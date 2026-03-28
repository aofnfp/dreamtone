import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { usePremiumStore } from '@/store/premium-store';
import { useTheme } from '@/store/theme-context';

export default function AdBanner() {
  const isPremium = usePremiumStore(s => s.isPremium);
  const { colors } = useTheme();

  if (isPremium || Platform.OS === 'web') return null;

  // AdMob requires native — show placeholder in dev
  let BannerAdComponent: any = null;
  let BannerAdSize: any = null;
  let BANNER_ID: string | undefined;

  try {
    const admob = require('react-native-google-mobile-ads');
    BannerAdComponent = admob.BannerAd;
    BannerAdSize = admob.BannerAdSize;
    BANNER_ID = Platform.select({
      ios: admob.TestIds.ADAPTIVE_BANNER,
      android: admob.TestIds.ADAPTIVE_BANNER,
    });
  } catch {
    return null;
  }

  if (!BannerAdComponent || !BANNER_ID) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.outline }]}>
      <BannerAdComponent
        unitId={BANNER_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
});
