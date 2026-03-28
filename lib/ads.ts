import { Platform } from 'react-native';

let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

// Lazy load to avoid crashes on web
async function loadAdMob() {
  if (Platform.OS === 'web') return;
  try {
    const admob = require('react-native-google-mobile-ads');
    BannerAd = admob.BannerAd;
    BannerAdSize = admob.BannerAdSize;
    TestIds = admob.TestIds;
  } catch (e) {
    console.warn('AdMob not available:', e);
  }
}

export const BANNER_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/2435281174', // Test ID
  android: 'ca-app-pub-3940256099942544/6300978111', // Test ID
  default: undefined,
});

export { BannerAd, BannerAdSize, TestIds, loadAdMob };
