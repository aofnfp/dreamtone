import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/store/theme-context';
import { useSoundStore } from '@/store/sound-store';
import { usePremiumStore } from '@/store/premium-store';
import { SOUND_CATALOG, CATEGORY_ORDER, CATEGORY_LABELS } from '@/constants/sounds';
import SoundCard from '@/components/SoundCard';
import AdBanner from '@/components/AdBanner';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { activeSounds, toggleSound } = useSoundStore();
  const isPremium = usePremiumStore(s => s.isPremium);

  const handleToggle = useCallback(async (soundId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await toggleSound(soundId, isPremium);
  }, [toggleSound, isPremium]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    categorySection: { marginTop: 24, paddingHorizontal: 20 },
    categoryTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
    soundGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  }), [colors]);

  const activeIds = useMemo(() => new Set(activeSounds.map(s => s.id)), [activeSounds]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>DreamTone</Text>
        <Text style={styles.subtitle}>Mix sounds for better sleep</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {CATEGORY_ORDER.map(category => {
          const sounds = SOUND_CATALOG.filter(s => s.category === category);
          return (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{CATEGORY_LABELS[category]}</Text>
              <View style={styles.soundGrid}>
                {sounds.map(sound => (
                  <SoundCard
                    key={sound.id}
                    sound={sound}
                    isActive={activeIds.has(sound.id)}
                    isLocked={!isPremium && sound.premium}
                    onPress={() => handleToggle(sound.id)}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}
