import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.945d74c3040b40289e51a80bffbff4cf',
  appName: 'Weather Check-in App',
  webDir: 'dist',
  server: {
    url: 'https://945d74c3-040b-4028-9e51-a80bffbff4cf.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#e0f2fe',
      showSpinner: false
    }
  }
};

export default config;