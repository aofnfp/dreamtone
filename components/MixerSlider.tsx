import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X, Volume1, Volume2, VolumeX } from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useSoundStore } from '@/store/sound-store';
import { usePremiumStore } from '@/store/premium-store';
import { SOUND_CATALOG } from '@/constants/sounds';

interface MixerSliderProps {
  soundId: string;
  volume: number;
}

const VOLUME_STEPS = [0.25, 0.5, 0.75, 1.0];

export default function MixerSlider({ soundId, volume }: MixerSliderProps) {
  const { colors } = useTheme();
  const { setSoundVolume, toggleSound } = useSoundStore();
  const isPremium = usePremiumStore(s => s.isPremium);
  const soundDef = SOUND_CATALOG.find(s => s.id === soundId);
  const IconComponent = soundDef ? (LucideIcons as any)[soundDef.icon] || LucideIcons.Music : LucideIcons.Music;

  const handleRemove = useCallback(async () => {
    await toggleSound(soundId, isPremium);
  }, [soundId, toggleSound, isPremium]);

  const handleVolume = useCallback(async (v: number) => {
    await setSoundVolume(soundId, v);
  }, [soundId, setSoundVolume]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    icon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    removeButton: {
      padding: 4,
    },
    volumeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
    },
    volumeBar: {
      flex: 1,
      flexDirection: 'row',
      gap: 6,
    },
    volumeStep: {
      flex: 1,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    volumeLabel: {
      fontSize: 11,
      fontWeight: '600',
    },
  }), [colors]);

  const getVolumeIcon = () => {
    if (volume <= 0.25) return <VolumeX size={16} color={colors.textMuted} />;
    if (volume <= 0.5) return <Volume1 size={16} color={colors.textSecondary} />;
    return <Volume2 size={16} color={colors.primary} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <View style={styles.icon}>
            <IconComponent size={18} color={colors.primary} />
          </View>
          <Text style={styles.name}>{soundDef?.name || soundId}</Text>
        </View>
        <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
          <X size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
      <View style={styles.volumeRow}>
        {getVolumeIcon()}
        <View style={styles.volumeBar}>
          {VOLUME_STEPS.map(step => {
            const isActive = Math.abs(volume - step) < 0.05;
            const isFilled = volume >= step;
            return (
              <TouchableOpacity
                key={step}
                style={[
                  styles.volumeStep,
                  {
                    backgroundColor: isFilled ? colors.primaryMuted : colors.surfaceElevated,
                    borderWidth: isActive ? 1.5 : 0,
                    borderColor: isActive ? colors.primary : 'transparent',
                  },
                ]}
                onPress={() => handleVolume(step)}
              >
                <Text style={[styles.volumeLabel, { color: isFilled ? colors.primary : colors.textMuted }]}>
                  {Math.round(step * 100)}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
