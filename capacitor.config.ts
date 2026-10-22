import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.beyondagency.beyondleveling',
  appName: 'Beyond Leveling',
  webDir: 'native-web',
  plugins: { LocalNotifications: { presentationOptions: [] } },
  ios: { contentInset: 'never', backgroundColor: '#020711' },
};
export default config;
