import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Timer, TimerOff } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useSoundStore } from '@/store/sound-store';
import { TimerDuration } from '@/types';

const PRESETS: { value: TimerDuration; label: string }[] = [
  { value: 'off', label: 'Off' },
  { value: 15, label: '15m' },
  { value: 30, label: '30m' },
  { value: 45, label: '45m' },
  { value: 60, label: '1h' },
  { value: 90, label: '1.5h' },
];

export default function TimerPicker() {
  const { colors } = useTheme();
  const { timerDuration, timerActive, setTimerDuration, startTimer, stopTimer, isAnyPlaying } = useSoundStore();

  const handlePreset = useCallback((value: TimerDuration) => {
    setTimerDuration(value);
    if (value === 'off') {
      stopTimer();
    }
  }, [setTimerDuration, stopTimer]);

  const handleToggleTimer = useCallback(() => {
    if (timerActive) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [timerActive, startTimer, stopTimer]);

  const styles = useMemo(() => StyleSheet.create({
    container: {},
    presets: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    preset: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1.5,
    },
    presetLabel: {
      fontSize: 13,
      fontWeight: '600',
    },
    timerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 12,
      paddingVertical: 14,
      marginTop: 16,
    },
    timerButtonText: {
      fontSize: 15,
      fontWeight: '700',
    },
  }), [colors]);

  const canStart = isAnyPlaying && timerDuration !== 'off';

  return (
    <View style={styles.container}>
      <View style={styles.presets}>
        {PRESETS.map(p => {
          const isSelected = timerDuration === p.value;
          return (
            <TouchableOpacity
              key={String(p.value)}
              style={[
                styles.preset,
                {
                  backgroundColor: isSelected ? colors.primaryMuted : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.outline,
                },
              ]}
              onPress={() => handlePreset(p.value)}
            >
              <Text style={[styles.presetLabel, { color: isSelected ? colors.primary : colors.textSecondary }]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {timerDuration !== 'off' && (
        <TouchableOpacity
          style={[
            styles.timerButton,
            {
              backgroundColor: timerActive ? colors.danger : (canStart ? colors.primary : colors.surfaceElevated),
              opacity: canStart || timerActive ? 1 : 0.5,
            },
          ]}
          onPress={handleToggleTimer}
          disabled={!canStart && !timerActive}
        >
          {timerActive ? <TimerOff size={18} color="#FFFFFF" /> : <Timer size={18} color={canStart ? '#FFFFFF' : colors.textMuted} />}
          <Text style={[styles.timerButtonText, { color: timerActive || canStart ? '#FFFFFF' : colors.textMuted }]}>
            {timerActive ? 'Stop Timer' : 'Start Timer'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
