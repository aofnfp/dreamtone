import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Play, Square, Timer, Moon } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useSoundStore } from '@/store/sound-store';
import MixerSlider from '@/components/MixerSlider';
import TimerPicker from '@/components/TimerPicker';

export default function MixerScreen() {
  const { colors } = useTheme();
  const { activeSounds, isAnyPlaying, stopAllSounds, timerActive, timerRemainingMs } = useSoundStore();

  const handleStopAll = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await stopAllSounds();
  }, [stopAllSounds]);

  const formatTime = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
    emptyIcon: { marginBottom: 16 },
    emptyText: { fontSize: 18, fontWeight: '600', color: colors.textSecondary },
    emptyHint: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    section: { marginTop: 24 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
    timerDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    timerText: { fontSize: 32, fontWeight: '300', color: colors.primary, fontVariant: ['tabular-nums'] },
    timerLabel: { fontSize: 12, color: colors.textMuted },
    stopButton: { backgroundColor: colors.danger, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 32 },
    stopText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  }), [colors]);

  if (!isAnyPlaying && activeSounds.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Mixer</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Moon size={48} color={colors.textMuted} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>No sounds playing</Text>
          <Text style={styles.emptyHint}>Browse the Sounds tab to add sounds to your mix</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mixer</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {timerActive && (
          <View style={styles.timerDisplay}>
            <Timer size={20} color={colors.primary} />
            <Text style={styles.timerText}>{formatTime(timerRemainingMs)}</Text>
            <Text style={styles.timerLabel}>remaining</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Sounds</Text>
          {activeSounds.map(sound => (
            <MixerSlider key={sound.id} soundId={sound.id} volume={sound.volume} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Timer</Text>
          <TimerPicker />
        </View>

        <TouchableOpacity style={styles.stopButton} onPress={handleStopAll} activeOpacity={0.8}>
          <Text style={styles.stopText}>Stop All</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
