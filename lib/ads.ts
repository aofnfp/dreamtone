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
    if (__DEV__) console.warn('AdMob not available:', e);
  }
}

// Production ad unit IDs — replace with real IDs from AdMob console
const PRODUCTION_BANNER_IDS = {
  ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
};

// Test IDs for development
const TEST_BANNER_IDS = {
  ios: 'ca-app-pub-3940256099942544/2435281174',
  android: 'ca-app-pub-3940256099942544/6300978111',
};

export const BANNER_ID = Platform.select({
  ios: __DEV__ ? TEST_BANNER_IDS.ios : PRODUCTION_BANNER_IDS.ios,
  android: __DEV__ ? TEST_BANNER_IDS.android : PRODUCTION_BANNER_IDS.android,
  default: undefined,
});

export { BannerAd, BannerAdSize, TestIds, loadAdMob };
