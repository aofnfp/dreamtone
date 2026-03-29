import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/store/theme-context';
import { initAudio } from '@/lib/audio';
import { initPurchases } from '@/lib/purchases';
import { requestTrackingPermission } from '@/lib/tracking';
import { usePremiumStore } from '@/store/premium-store';
import { useSoundStore } from '@/store/sound-store';
import { useFavoritesStore } from '@/store/favorites-store';

SplashScreen.preventAutoHideAsync();

function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      try {
        await requestTrackingPermission();
        await initAudio();
        await initPurchases();
        await usePremiumStore.getState().loadStatus();
        usePremiumStore.getState().startListening();
        await useSoundStore.getState().loadFromStorage();
        await useFavoritesStore.getState().loadFavorites();
      } catch (e) {
        if (__DEV__) console.warn('Init error:', e);
      } finally {
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppInitializer>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppInitializer>
    </ThemeProvider>
  );
}
