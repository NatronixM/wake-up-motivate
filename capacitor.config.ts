import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3028245b10f84d369aa4b049d04f8715',
  appName: 'Motivational Alarm Clock - Rise & Thrive',
  webDir: 'dist',
  server: {
    url: 'https://3028245b-10f8-4d36-9aa4-b049d04f8715.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#a855f7",
      sound: "motivational_alarm.wav",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1625',
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#1a1625"
    },
    Device: {
      // Enable device info access
    },
    Haptics: {
      // Enable vibration feedback
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  ios: {
    contentInset: "automatic",
    scrollEnabled: true
  }
};

export default config;