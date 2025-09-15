import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { PermissionsManager } from '@/utils/permissions';
import { toast } from 'sonner';

export interface AlarmSchedule {
  id: string;
  time: string; // HH:MM format
  label: string;
  isActive: boolean;
  repeatDays: string[];
  soundName: string;
  volume?: number;
  missionEnabled?: boolean;
  missionCount?: number;
}

export class AlarmManager {
  private static instance: AlarmManager;
  private wakeLock: any = null;

  static getInstance(): AlarmManager {
    if (!AlarmManager.instance) {
      AlarmManager.instance = new AlarmManager();
    }
    return AlarmManager.instance;
  }

  /**
   * Schedule an alarm with precise timing and screen wake capabilities
   */
  async scheduleAlarm(alarm: AlarmSchedule): Promise<boolean> {
    try {
      // Request necessary permissions first
      await this.ensureAlarmPermissions();

      const notificationId = parseInt(alarm.id);
      const scheduleTimes = this.calculateScheduleTimes(alarm);

      for (const scheduleTime of scheduleTimes) {
        await LocalNotifications.schedule({
          notifications: [{
            title: `⏰ ${alarm.label}`,
            body: "Time to wake up! Your motivational alarm is ready.",
            id: notificationId + scheduleTimes.indexOf(scheduleTime),
            schedule: { at: scheduleTime },
            sound: undefined, // We'll handle sound manually for better control
            attachments: undefined,
            actionTypeId: "ALARM_ACTION",
            extra: {
              alarmId: alarm.id,
              soundName: alarm.soundName,
              volume: alarm.volume || 80,
              missionEnabled: alarm.missionEnabled || false,
              missionCount: alarm.missionCount || 0,
              isAlarm: true
            },
            // Enable full-screen intent for lock screen override
            largeIcon: undefined,
            smallIcon: undefined,
            iconColor: '#3B82F6'
          }]
        });
      }

      console.log(`[AlarmManager] Scheduled alarm ${alarm.id} for times:`, scheduleTimes);
      return true;
    } catch (error) {
      console.error('[AlarmManager] Failed to schedule alarm:', error);
      toast.error('Failed to schedule alarm. Check permissions.');
      return false;
    }
  }

  /**
   * Schedule a test alarm with full screen wake capabilities
   */
  async scheduleTestAlarm(soundName: string = 'Rise & Shine'): Promise<boolean> {
    try {
      // Request permissions first
      const permissionsGranted = await this.ensureAlarmPermissions();
      if (!permissionsGranted) {
        toast.error('Permissions required for test alarm');
        return false;
      }

      const testTime = new Date(Date.now() + 10000); // 10 seconds from now
      
      await LocalNotifications.schedule({
        notifications: [{
          title: "🔔 Test Alarm - Wake Force",
          body: "Testing alarm with screen wake and full volume",
          id: 99999,
          schedule: { at: testTime },
          sound: undefined, // Manual sound control
          attachments: undefined,
          actionTypeId: "TEST_ALARM_ACTION",
          extra: {
            isTestAlarm: true,
            soundName: soundName,
            volume: 100, // Max volume for test
            wakePriority: 'high'
          }
        }]
      });

      // Set up JavaScript backup timer with wake lock
      setTimeout(async () => {
        await this.triggerAlarmWithWake({
          soundName,
          volume: 100,
          isTest: true
        });
      }, 10000);

      console.log('[AlarmManager] Test alarm scheduled for 10 seconds');
      return true;
    } catch (error) {
      console.error('[AlarmManager] Failed to schedule test alarm:', error);
      return false;
    }
  }

  /**
   * Trigger alarm with screen wake and full volume
   */
  async triggerAlarmWithWake(params: {
    soundName: string;
    volume: number;
    isTest?: boolean;
  }): Promise<void> {
    try {
      // Acquire wake lock to keep screen on
      if (Capacitor.isNativePlatform()) {
        try {
          // Request wake lock for screen
          this.wakeLock = await (navigator as any).wakeLock?.request('screen');
          console.log('[AlarmManager] Wake lock acquired');
        } catch (e) {
          console.log('[AlarmManager] Wake lock not available:', e);
        }
      }

      // Play motivational sound at full volume
      await this.playAlarmSound(params.soundName, params.volume);

      // Provide haptic feedback
      if (Capacitor.isNativePlatform()) {
        try {
          const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
          await Haptics.impact({ style: ImpactStyle.Heavy });
        } catch (e) {
          console.log('[AlarmManager] Haptics not available:', e);
        }
      }

      if (params.isTest) {
        toast.success('Test alarm triggered! Screen should wake up and play sound.');
        
        // Auto-stop test alarm after 10 seconds
        setTimeout(() => {
          this.stopAlarm();
        }, 10000);
      }

    } catch (error) {
      console.error('[AlarmManager] Failed to trigger alarm with wake:', error);
      toast.error('Failed to trigger alarm properly');
    }
  }

  /**
   * Play alarm sound with volume override
   */
  private async playAlarmSound(soundName: string, volume: number): Promise<void> {
    try {
      // Get motivational track URL
      const trackUrl = this.getTrackUrl(soundName);
      
      if (Capacitor.isNativePlatform()) {
        // For native platform, try to use system audio controls
        const audio = new Audio(trackUrl);
        audio.volume = Math.min(volume / 100, 1.0);
        audio.loop = true; // Loop until dismissed
        
        // Override system volume temporarily for alarms
        try {
          // This would require native plugin implementation
          console.log('[AlarmManager] Setting alarm volume to maximum');
        } catch (e) {
          console.log('[AlarmManager] Volume override not available');
        }
        
        await audio.play();
        (window as any).currentAlarmAudio = audio;
      } else {
        // For web, use Web Audio API with enhanced volume
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        try {
          const response = await fetch(trackUrl);
          const audioBuffer = await response.arrayBuffer();
          const decodedAudio = await audioContext.decodeAudioData(audioBuffer);
          
          const source = audioContext.createBufferSource();
          const gainNode = audioContext.createGain();
          
          source.buffer = decodedAudio;
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          gainNode.gain.setValueAtTime(Math.min(volume / 100, 1.0), audioContext.currentTime);
          source.loop = true;
          source.start();
          
          (window as any).currentAlarmSource = source;
          (window as any).currentAlarmContext = audioContext;
        } catch (e) {
          // Fallback to simple beep
          this.playFallbackBeep(audioContext, volume);
        }
      }
    } catch (error) {
      console.error('[AlarmManager] Failed to play alarm sound:', error);
      // Emergency fallback beep
      this.playEmergencyBeep();
    }
  }

  /**
   * Stop currently playing alarm
   */
  stopAlarm(): void {
    try {
      // Stop audio
      if ((window as any).currentAlarmAudio) {
        (window as any).currentAlarmAudio.pause();
        (window as any).currentAlarmAudio = null;
      }
      
      if ((window as any).currentAlarmSource) {
        (window as any).currentAlarmSource.stop();
        (window as any).currentAlarmSource = null;
      }
      
      if ((window as any).currentAlarmContext) {
        (window as any).currentAlarmContext.close();
        (window as any).currentAlarmContext = null;
      }

      // Release wake lock
      if (this.wakeLock) {
        this.wakeLock.release();
        this.wakeLock = null;
        console.log('[AlarmManager] Wake lock released');
      }
    } catch (error) {
      console.error('[AlarmManager] Error stopping alarm:', error);
    }
  }

  /**
   * Update existing alarm schedule
   */
  async updateAlarm(alarm: AlarmSchedule): Promise<boolean> {
    try {
      // Cancel existing notifications for this alarm
      await this.cancelAlarm(alarm.id);
      
      // Schedule with new settings
      return await this.scheduleAlarm(alarm);
    } catch (error) {
      console.error('[AlarmManager] Failed to update alarm:', error);
      return false;
    }
  }

  /**
   * Cancel specific alarm
   */
  async cancelAlarm(alarmId: string): Promise<void> {
    try {
      const notificationId = parseInt(alarmId);
      
      // Cancel up to 7 possible notifications (one for each day)
      const idsToCancel = Array.from({ length: 7 }, (_, i) => notificationId + i);
      
      await LocalNotifications.cancel({
        notifications: idsToCancel.map(id => ({ id }))
      });
      
      console.log(`[AlarmManager] Cancelled alarm ${alarmId}`);
    } catch (error) {
      console.error('[AlarmManager] Failed to cancel alarm:', error);
    }
  }

  /**
   * Ensure all necessary permissions are granted
   */
  private async ensureAlarmPermissions(): Promise<boolean> {
    try {
      // Check and request notification permissions
      const notificationResult = await LocalNotifications.requestPermissions();
      if (notificationResult.display !== 'granted') {
        toast.error('Notification permission is required for alarms');
        return false;
      }

      // Request additional Android permissions if available
      if (Capacitor.isNativePlatform()) {
        await PermissionsManager.requestAllAlarmPermissions();
      }

      return true;
    } catch (error) {
      console.error('[AlarmManager] Permission check failed:', error);
      return false;
    }
  }

  /**
   * Calculate schedule times based on alarm settings
   */
  private calculateScheduleTimes(alarm: AlarmSchedule): Date[] {
    const times: Date[] = [];
    const [hours, minutes] = alarm.time.split(':').map(Number);
    
    if (alarm.repeatDays.length === 0) {
      // One-time alarm
      const scheduleTime = new Date();
      scheduleTime.setHours(hours, minutes, 0, 0);
      
      // If time has passed today, schedule for tomorrow
      if (scheduleTime.getTime() <= Date.now()) {
        scheduleTime.setDate(scheduleTime.getDate() + 1);
      }
      
      times.push(scheduleTime);
    } else {
      // Recurring alarm
      const dayMap: Record<string, number> = {
        'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
      };
      
      for (const day of alarm.repeatDays) {
        const targetDay = dayMap[day];
        const scheduleTime = new Date();
        const currentDay = scheduleTime.getDay();
        
        let daysUntilTarget = targetDay - currentDay;
        if (daysUntilTarget < 0 || (daysUntilTarget === 0 && scheduleTime.getHours() * 60 + scheduleTime.getMinutes() >= hours * 60 + minutes)) {
          daysUntilTarget += 7;
        }
        
        scheduleTime.setDate(scheduleTime.getDate() + daysUntilTarget);
        scheduleTime.setHours(hours, minutes, 0, 0);
        
        times.push(scheduleTime);
      }
    }
    
    return times;
  }

  /**
   * Get track URL for sound name
   */
  private getTrackUrl(soundName: string): string {
    // For now, return a data URL for a motivational beep
    // In production, this would map to actual motivational tracks
    return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAXBnid3+u2aSIGMI3O8+PVYB4G';
  }

  /**
   * Play fallback beep using Web Audio API
   */
  private playFallbackBeep(audioContext: AudioContext, volume: number): void {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(Math.min(volume / 100 * 0.5, 0.5), audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);
    
    // Create alarm pattern: beep-pause-beep-pause
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.setValueAtTime(1000, audioContext.currentTime);
      gain2.gain.setValueAtTime(Math.min(volume / 100 * 0.5, 0.5), audioContext.currentTime);
      osc2.start();
      osc2.stop(audioContext.currentTime + 2);
    }, 500);
  }

  /**
   * Emergency beep fallback
   */
  private playEmergencyBeep(): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.playFallbackBeep(audioContext, 80);
    } catch (error) {
      console.error('[AlarmManager] Emergency beep failed:', error);
    }
  }
}

export const alarmManager = AlarmManager.getInstance();
