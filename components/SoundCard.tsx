import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Lock } from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { SoundDefinition } from '@/types';

const CARD_GAP = 12;
const CARD_WIDTH = (Dimensions.get('window').width - 40 - CARD_GAP) / 2;

interface SoundCardProps {
  sound: SoundDefinition;
  isActive: boolean;
  isLocked: boolean;
  onPress: () => void;
}

export default function SoundCard({ sound, isActive, isLocked, onPress }: SoundCardProps) {
  const { colors } = useTheme();

  // Dynamically get the lucide icon
  const IconComponent = (LucideIcons as any)[sound.icon] || LucideIcons.Music;

  const styles = useMemo(() => StyleSheet.create({
    card: {
      width: CARD_WIDTH,
      backgroundColor: isActive ? colors.primaryMuted : colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1.5,
      borderColor: isActive ? colors.primary : colors.outline,
      alignItems: 'center',
      gap: 10,
      opacity: isLocked ? 0.6 : 1,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isActive ? colors.primary : colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      fontSize: 13,
      fontWeight: '600',
      color: isActive ? colors.primary : colors.textPrimary,
      textAlign: 'center',
    },
    lockBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
    },
  }), [colors, isActive, isLocked]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={isLocked ? undefined : onPress}
      activeOpacity={isLocked ? 1 : 0.7}
      disabled={isLocked}
    >
      {isLocked && (
        <View style={styles.lockBadge}>
          <Lock size={14} color={colors.textMuted} />
        </View>
      )}
      <View style={styles.iconContainer}>
        <IconComponent size={22} color={isActive ? '#FFFFFF' : colors.textSecondary} />
      </View>
      <Text style={styles.name} numberOfLines={1}>{sound.name}</Text>
    </TouchableOpacity>
  );
}
