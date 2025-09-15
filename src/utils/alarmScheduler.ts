// Alarm scheduling utilities for background functionality
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PermissionsManager } from './permissions';

export interface Alarm {
  id: string;
  time: string;
  label?: string;
  isActive: boolean;
  repeatDays?: string[];
  soundName?: string;
  volume?: number;
}

export class AlarmScheduler {
  // Schedule an alarm with native notifications
  static async scheduleAlarm(alarm: Alarm): Promise<boolean> {
    try {
      if (!alarm.isActive) {
        return false;
      }

      // Request permissions first
      const hasPermissions = await PermissionsManager.requestNotificationPermission();
      if (!hasPermissions) {
        throw new Error('Notification permissions not granted');
      }

      if (Capacitor.isNativePlatform()) {
        return await this.scheduleNativeAlarm(alarm);
      } else {
        return await this.scheduleWebAlarm(alarm);
      }
    } catch (error) {
      console.error('Failed to schedule alarm:', error);
      return false;
    }
  }

  // Schedule native alarm using Capacitor
  private static async scheduleNativeAlarm(alarm: Alarm): Promise<boolean> {
    try {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const now = new Date();
      const alarmDate = new Date();
      alarmDate.setHours(hours, minutes, 0, 0);

      // If alarm time is in the past, schedule for next day
      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Wake Force - Time to Rise!',
            body: alarm.label || 'Your motivational alarm is ready to wake you up!',
            id: parseInt(alarm.id) || Math.floor(Math.random() * 10000),
            schedule: { at: alarmDate },
            sound: 'alarm_sound.wav',
            actionTypeId: 'WAKE_FORCE_ALARM',
            extra: {
              alarmId: alarm.id,
              soundName: alarm.soundName,
              volume: alarm.volume || 80,
              isAlarm: true
            }
          }
        ]
      });

      console.log(`Native alarm scheduled for ${alarmDate.toLocaleString()}`);
      return true;
    } catch (error) {
      console.error('Failed to schedule native alarm:', error);
      return false;
    }
  }

  // Schedule web alarm using service worker
  private static async scheduleWebAlarm(alarm: Alarm): Promise<boolean> {
    try {
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported');
        return false;
      }

      // Store alarm in local storage for service worker access
      const alarms = this.getStoredAlarms();
      const existingIndex = alarms.findIndex(a => a.id === alarm.id);
      
      if (existingIndex >= 0) {
        alarms[existingIndex] = alarm;
      } else {
        alarms.push(alarm);
      }
      
      localStorage.setItem('wake-force-alarms', JSON.stringify(alarms));

      // Register for background sync if supported
      if ('serviceWorker' in navigator && 'sync' in (window as any).ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register('background-sync-alarms');
      }

      // Set up a timer for immediate checking (for current session)
      this.setupAlarmTimer(alarm);

      console.log(`Web alarm scheduled for ${alarm.time}`);
      return true;
    } catch (error) {
      console.error('Failed to schedule web alarm:', error);
      return false;
    }
  }

  // Cancel an alarm
  static async cancelAlarm(alarmId: string): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.cancel({
          notifications: [{ id: parseInt(alarmId) || 1 }]
        });
      }

      // Remove from local storage
      const alarms = this.getStoredAlarms();
      const filteredAlarms = alarms.filter(a => a.id !== alarmId);
      localStorage.setItem('wake-force-alarms', JSON.stringify(filteredAlarms));

      console.log(`Alarm ${alarmId} cancelled`);
      return true;
    } catch (error) {
      console.error('Failed to cancel alarm:', error);
      return false;
    }
  }

  // Get stored alarms from local storage
  static getStoredAlarms(): Alarm[] {
    try {
      const stored = localStorage.getItem('wake-force-alarms');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored alarms:', error);
      return [];
    }
  }

  // Set up timer for web alarm checking
  private static setupAlarmTimer(alarm: Alarm): void {
    const checkAlarm = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (alarm.isActive && alarm.time === currentTime) {
        this.triggerWebAlarm(alarm);
      }
    };

    // Check every 30 seconds
    const intervalId = setInterval(checkAlarm, 30000);
    
    // Store interval ID for cleanup
    if (typeof window !== 'undefined') {
      (window as any).alarmIntervals = (window as any).alarmIntervals || new Set();
      (window as any).alarmIntervals.add(intervalId);
    }
  }

  // Trigger web alarm with notification and audio
  private static async triggerWebAlarm(alarm: Alarm): Promise<void> {
    try {
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const notificationOptions: NotificationOptions = {
          body: alarm.label || 'Time to wake up and seize the day!',
          icon: '/favicon.ico',
          requireInteraction: true,
        };

        // Add vibrate if supported (for mobile browsers)
        if ('vibrate' in navigator) {
          navigator.vibrate([500, 110, 500, 110, 450, 110, 200]);
        }

        const notification = new Notification('Wake Force Alarm!', notificationOptions);

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }

      // Play alarm sound
      this.playAlarmSound(alarm);

      // Send message to main app if it's open
      if (typeof window !== 'undefined' && window.postMessage) {
        window.postMessage({
          type: 'ALARM_TRIGGERED',
          alarm: alarm
        }, '*');
      }

    } catch (error) {
      console.error('Failed to trigger web alarm:', error);
    }
  }

  // Play alarm sound with maximum volume
  private static playAlarmSound(alarm: Alarm): void {
    try {
      const audio = new Audio('/sounds/placeholder.txt'); // You'll need actual audio files
      audio.volume = (alarm.volume || 80) / 100;
      audio.loop = true;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing alarm sound:', error);
        });
      }

      // Store audio reference for stopping later
      if (typeof window !== 'undefined') {
        (window as any).currentAlarmAudio = audio;
      }
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
    }
  }

  // Stop current alarm sound
  static stopAlarmSound(): void {
    try {
      if (typeof window !== 'undefined' && (window as any).currentAlarmAudio) {
        (window as any).currentAlarmAudio.pause();
        (window as any).currentAlarmAudio.currentTime = 0;
        (window as any).currentAlarmAudio = null;
      }
    } catch (error) {
      console.error('Failed to stop alarm sound:', error);
    }
  }

  // Initialize alarm scheduler
  static async initialize(): Promise<void> {
    try {
      // Request all necessary permissions
      await PermissionsManager.requestAllAlarmPermissions();

      // Set up message listener for service worker communication
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'ALARM_TRIGGERED') {
            console.log('Alarm triggered by service worker:', event.data.alarm);
            // Handle alarm trigger from service worker
          }
        });
      }

      // Schedule all active alarms
      const storedAlarms = this.getStoredAlarms();
      for (const alarm of storedAlarms) {
        if (alarm.isActive) {
          await this.scheduleAlarm(alarm);
        }
      }

      console.log('Alarm scheduler initialized');
    } catch (error) {
      console.error('Failed to initialize alarm scheduler:', error);
    }
  }
}