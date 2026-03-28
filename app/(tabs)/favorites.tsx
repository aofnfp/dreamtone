import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Heart, Play, Trash2, Plus, BookmarkPlus } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { useSoundStore } from '@/store/sound-store';
import { useFavoritesStore } from '@/store/favorites-store';
import { usePremiumStore } from '@/store/premium-store';
import { SOUND_CATALOG } from '@/constants/sounds';
import AdBanner from '@/components/AdBanner';

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const { activeSounds, toggleSound, stopAllSounds } = useSoundStore();
  const { favorites, saveMix, deleteMix } = useFavoritesStore();
  const isPremium = usePremiumStore(s => s.isPremium);
  const [showNameInput, setShowNameInput] = useState(false);
  const [mixName, setMixName] = useState('');

  const handleSaveMix = useCallback(async () => {
    if (activeSounds.length === 0) {
      Alert.alert('No sounds', 'Play some sounds first to save a mix.');
      return;
    }
    setShowNameInput(true);
  }, [activeSounds]);

  const handleConfirmSave = useCallback(async () => {
    const name = mixName.trim() || `Mix ${favorites.length + 1}`;
    await saveMix(name, activeSounds);
    setShowNameInput(false);
    setMixName('');
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [mixName, activeSounds, favorites.length, saveMix]);

  const handlePlayMix = useCallback(async (sounds: { id: string; volume: number }[]) => {
    await stopAllSounds();
    for (const s of sounds) {
      await toggleSound(s.id, isPremium);
    }
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [stopAllSounds, toggleSound, isPremium]);

  const handleDelete = useCallback((id: string, name: string) => {
    Alert.alert('Delete Mix', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMix(id) },
    ]);
  }, [deleteMix]);

  const getSoundName = (id: string) => SOUND_CATALOG.find(s => s.id === id)?.name || id;

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    saveButton: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 },
    saveText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
    inputRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
    input: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: colors.outline },
    confirmButton: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
    confirmText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
    emptyIcon: { marginBottom: 16 },
    emptyText: { fontSize: 18, fontWeight: '600', color: colors.textSecondary },
    emptyHint: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
    card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: colors.outline },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1 },
    cardActions: { flexDirection: 'row', gap: 12 },
    cardSounds: { marginTop: 8 },
    cardSoundText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  }), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeSounds.length > 0 && !showNameInput && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveMix} activeOpacity={0.8}>
            <BookmarkPlus size={18} color="#FFFFFF" />
            <Text style={styles.saveText}>Save Current Mix</Text>
          </TouchableOpacity>
        )}
        {showNameInput && (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Mix name..."
              placeholderTextColor={colors.textMuted}
              value={mixName}
              onChangeText={setMixName}
              autoFocus
              onSubmitEditing={handleConfirmSave}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSave}>
              <Text style={styles.confirmText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}

        {favorites.length === 0 && !showNameInput ? (
          <View style={styles.emptyContainer}>
            <Heart size={48} color={colors.textMuted} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No saved mixes</Text>
            <Text style={styles.emptyHint}>Play some sounds and tap "Save Current Mix" to create a favorite</Text>
          </View>
        ) : (
          favorites.map(fav => (
            <View key={fav.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardName} numberOfLines={1}>{fav.name}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => handlePlayMix(fav.sounds)}>
                    <Play size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(fav.id, fav.name)}>
                    <Trash2 size={20} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.cardSounds}>
                <Text style={styles.cardSoundText}>
                  {fav.sounds.map(s => getSoundName(s.id)).join(' \u00B7 ')}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <AdBanner />
    </SafeAreaView>
  );
}
