// Capacitor permissions and native device capabilities
import { Capacitor } from '@capacitor/core';

export interface PermissionStatus {
  granted: boolean;
  canRequest: boolean;
  description: string;
}

export interface AndroidPermissions {
  displayOverApps: PermissionStatus;
  batteryOptimization: PermissionStatus;
  notifications: PermissionStatus;
  exactAlarms: PermissionStatus;
  systemAlertWindow: PermissionStatus;
  modifyAudioSettings: PermissionStatus;
  wakeLock: PermissionStatus;
}

export class PermissionsManager {
  private static packageName = 'app.lovable.3028245b10f84d369aa4b049d04f8715';

  // Get current permission statuses
  static async getPermissionStatuses(): Promise<AndroidPermissions> {
    const permissions: AndroidPermissions = {
      displayOverApps: {
        granted: false,
        canRequest: true,
        description: 'Allows app to display over other apps and show alarm screen when locked'
      },
      batteryOptimization: {
        granted: false,
        canRequest: true,
        description: 'Prevents system from killing alarm functionality in background'
      },
      notifications: {
        granted: false,
        canRequest: true,
        description: 'Required for alarm notifications and alerts'
      },
      exactAlarms: {
        granted: false,
        canRequest: true,
        description: 'Allows app to schedule precise alarm times (Android 12+)'
      },
      systemAlertWindow: {
        granted: false,
        canRequest: true,
        description: 'Required to show alarm screen over lock screen'
      },
      modifyAudioSettings: {
        granted: false,
        canRequest: true,
        description: 'Allows app to control volume for reliable alarm sound'
      },
      wakeLock: {
        granted: false,
        canRequest: true,
        description: 'Keeps device awake during alarm dismissal'
      }
    };

    if (Capacitor.isNativePlatform()) {
      // Check actual permission statuses (would be implemented with native plugins)
      permissions.notifications.granted = await this.checkNotificationPermission();
      permissions.wakeLock.granted = 'wakeLock' in navigator;
    }

    return permissions;
  }

  // Open Android system settings for specific permissions
  static async openAndroidSettings(settingType: string): Promise<void> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
      console.warn('Android settings only available on Android platform');
      return;
    }

    try {
      const settingsMap: Record<string, string> = {
        displayOverApps: 'android.settings.action.MANAGE_OVERLAY_PERMISSION',
        batteryOptimization: 'android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
        notifications: 'android.settings.APP_NOTIFICATION_SETTINGS',
        exactAlarms: 'android.settings.REQUEST_SCHEDULE_EXACT_ALARM',
        appDetails: 'android.settings.APPLICATION_DETAILS_SETTINGS',
        sound: 'android.settings.SOUND_SETTINGS',
        lockScreen: 'android.settings.SECURITY_SETTINGS'
      };

      const action = settingsMap[settingType];
      if (!action) {
        throw new Error(`Unknown setting type: ${settingType}`);
      }

      // This would use a Capacitor plugin to open Android settings
      console.log(`Opening Android settings: ${action} for package: ${this.packageName}`);
      
      // In a real implementation, you'd use something like:
      // await AndroidSettings.openSettings({
      //   action: action,
      //   packageName: this.packageName
      // });
      
      // For web/demo, open a placeholder
      if (!Capacitor.isNativePlatform()) {
        alert(`Would open Android setting: ${settingType}\nAction: ${action}\nPackage: ${this.packageName}`);
      }
    } catch (error) {
      console.error(`Failed to open Android settings for ${settingType}:`, error);
      throw error;
    }
  }

  // Request permission to display over other apps (Android)
  static async requestDisplayOverAppsPermission(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
        await this.openAndroidSettings('displayOverApps');
        return true; // User will grant manually in settings
      }
      return true; // Web platform doesn't need this
    } catch (error) {
      console.error('Failed to request display over apps permission:', error);
      return false;
    }
  }

  // Request battery optimization exemption
  static async requestBatteryOptimizationExemption(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
        await this.openAndroidSettings('batteryOptimization');
        return true;
      }
      return true;
    } catch (error) {
      console.error('Failed to request battery optimization exemption:', error);
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

  // Check notification permission status
  static async checkNotificationPermission(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        // Would check with native plugin
        return true; // Mock for demo
      } else if ('Notification' in window) {
        return Notification.permission === 'granted';
      }
      return false;
    } catch (error) {
      console.error('Failed to check notification permission:', error);
      return false;
    }
  }

  // Request notification permissions
  static async requestNotificationPermission(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        await this.openAndroidSettings('notifications');
        return true;
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

  // Request exact alarm permission (Android 12+)
  static async requestExactAlarmPermission(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
        await this.openAndroidSettings('exactAlarms');
        return true;
      }
      return true;
    } catch (error) {
      console.error('Failed to request exact alarm permission:', error);
      return false;
    }
  }

  // Open app details in system settings
  static async openAppSettings(): Promise<void> {
    await this.openAndroidSettings('appDetails');
  }

  // Request all necessary permissions for alarm functionality
  static async requestAllAlarmPermissions(): Promise<{
    displayOverApps: boolean;
    microphone: boolean;
    notifications: boolean;
    motion: boolean;
    batteryOptimization: boolean;
    exactAlarms: boolean;
  }> {
    const [displayOverApps, microphone, notifications, motion, batteryOptimization, exactAlarms] = await Promise.all([
      this.requestDisplayOverAppsPermission(),
      this.requestMicrophonePermission(),
      this.requestNotificationPermission(),
      this.requestMotionPermission(),
      this.requestBatteryOptimizationExemption(),
      this.requestExactAlarmPermission(),
    ]);

    return {
      displayOverApps,
      microphone,
      notifications,
      motion,
      batteryOptimization,
      exactAlarms,
    };
  }

  // Get troubleshooting steps for common Android issues
  static getTroubleshootingSteps(): Array<{
    title: string;
    description: string;
    action: () => Promise<void>;
    critical: boolean;
  }> {
    return [
      {
        title: 'Display Over Other Apps',
        description: 'Allow app to show alarm screen even when phone is locked',
        action: () => this.openAndroidSettings('displayOverApps'),
        critical: true
      },
      {
        title: 'Battery Optimization',
        description: 'Prevent Android from stopping alarms in background',
        action: () => this.openAndroidSettings('batteryOptimization'),
        critical: true
      },
      {
        title: 'Notification Access',
        description: 'Enable notifications for alarm alerts',
        action: () => this.openAndroidSettings('notifications'),
        critical: true
      },
      {
        title: 'Exact Alarms (Android 12+)',
        description: 'Schedule precise alarm times',
        action: () => this.openAndroidSettings('exactAlarms'),
        critical: true
      },
      {
        title: 'Sound & Volume Settings',
        description: 'Ensure alarm can control volume levels',
        action: () => this.openAndroidSettings('sound'),
        critical: false
      },
      {
        title: 'App Details & Permissions',
        description: 'Review all app permissions',
        action: () => this.openAndroidSettings('appDetails'),
        critical: false
      }
    ];
  }
}