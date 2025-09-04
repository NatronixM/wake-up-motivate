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
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1625',
      showSpinner: false
    }
  }
};

export default config;