import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.samaabdountowers.com',
  appName: 'أبراج سما عبدون',
  webDir: 'www',
  "plugins": {
    "CapacitorFirebaseConfig": {
      "android": {
        "googleServicesFile": "./android/app/google-services.json"
      },
      "ios": {
        "googleServicesFile": "./ios/App/GoogleService-Info.plist"
      }
    }
  }
};

export default config;
