// Capacitor permissions and native device capabilities
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export class PermissionsManager {
  // Request permission to display over other apps (Android)
  static async requestDisplayOverAppsPermission(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
        // This would be implemented with a Capacitor plugin
        console.log('Requesting display over apps permission...');
        // In a real implementation, you'd use:
        // const result = await DisplayOverApps.requestPermission();
        // return result.granted;
        return true; // Mock for demo
      }
      return true; // Web platform doesn't need this
    } catch (error) {
      console.error('Failed to request display over apps permission:', error);
      return false;
    }
  }

  // Request microphone permission for sleep tracking
  static async requestMicrophonePermission(): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && 'mediaDevices' in navigator) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop immediately
        return true;
      }
      return false;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  // Request notification permissions
  static async requestNotificationPermission(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor Local Notifications plugin
        const permission = await LocalNotifications.requestPermissions();
        return permission.display === 'granted';
      } else if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  // Schedule alarm notification
  static async scheduleAlarmNotification(alarm: {
    id: string;
    time: string;
    label: string;
    soundName?: string;
  }): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.log('Alarm scheduling not available on web platform');
        return false;
      }

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
            title: 'Wake Force Alarm',
            body: alarm.label || 'Time to wake up!',
            id: parseInt(alarm.id) || 1,
            schedule: { at: alarmDate },
            sound: 'alarm.wav',
            actionTypeId: 'ALARM_ACTION',
            attachments: [],
            extra: {
              alarmId: alarm.id,
              soundName: alarm.soundName,
            }
          }
        ]
      });

      console.log(`Alarm scheduled for ${alarmDate.toLocaleString()}`);
      return true;
    } catch (error) {
      console.error('Failed to schedule alarm notification:', error);
      return false;
    }
  }

  // Cancel alarm notification
  static async cancelAlarmNotification(alarmId: string): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        return false;
      }

      await LocalNotifications.cancel({
        notifications: [{ id: parseInt(alarmId) || 1 }]
      });

      console.log(`Alarm ${alarmId} cancelled`);
      return true;
    } catch (error) {
      console.error('Failed to cancel alarm notification:', error);
      return false;
    }
  }

  // Request device motion/shake detection
  static async requestMotionPermission(): Promise<boolean> {
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && 
          typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        // iOS 13+ requires permission for device motion
        const permission = await (DeviceMotionEvent as any).requestPermission();
        return permission === 'granted';
      }
      return true; // Android doesn't require explicit permission
    } catch (error) {
      console.error('Failed to request motion permission:', error);
      return false;
    }
  }

  // Request all necessary permissions for alarm functionality
  static async requestAllAlarmPermissions(): Promise<{
    displayOverApps: boolean;
    microphone: boolean;
    notifications: boolean;
    motion: boolean;
  }> {
    const [displayOverApps, microphone, notifications, motion] = await Promise.all([
      this.requestDisplayOverAppsPermission(),
      this.requestMicrophonePermission(),
      this.requestNotificationPermission(),
      this.requestMotionPermission(),
    ]);

    return {
      displayOverApps,
      microphone,
      notifications,
      motion,
    };
  }
}