import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Sun, Crown, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { usePremiumStore } from '@/store/premium-store';
import { useSoundStore } from '@/store/sound-store';
import Paywall from '@/components/Paywall';

export default function SettingsScreen() {
  const { colors, theme, allThemes, applyTheme } = useTheme();
  const isPremium = usePremiumStore(s => s.isPremium);
  const { restore } = usePremiumStore();
  const { fadeOutEnabled, setFadeOutEnabled } = useSoundStore();
  const [showPaywall, setShowPaywall] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    section: { marginTop: 32 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
    row: { backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: colors.outline },
    rowLabel: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
    rowValue: { fontSize: 14, color: colors.textSecondary },
    themeRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
    themeOption: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 16, alignItems: 'center', gap: 8, borderWidth: 2 },
    themeLabel: { fontSize: 13, fontWeight: '600' },
    premiumCard: { backgroundColor: colors.primaryMuted, borderRadius: 16, padding: 20, marginTop: 16, borderWidth: 1, borderColor: colors.primary },
    premiumTitle: { fontSize: 18, fontWeight: '800', color: colors.primary, marginBottom: 4 },
    premiumText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    premiumButton: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
    premiumButtonText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
    restoreButton: { alignItems: 'center', marginTop: 12 },
    restoreText: { fontSize: 13, color: colors.textMuted },
    aboutText: { fontSize: 13, color: colors.textMuted, lineHeight: 20, marginTop: 8 },
    link: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
    linkText: { fontSize: 14, color: colors.primary },
    brandingText: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 24 },
  }), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.themeRow}>
            {allThemes.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[styles.themeOption, { borderColor: theme.id === t.id ? colors.primary : colors.outline }]}
                onPress={() => applyTheme(t.id)}
              >
                {t.id === 'dark' ? <Moon size={24} color={theme.id === t.id ? colors.primary : colors.textMuted} /> : <Sun size={24} color={theme.id === t.id ? colors.primary : colors.textMuted} />}
                <Text style={[styles.themeLabel, { color: theme.id === t.id ? colors.primary : colors.textSecondary }]}>{t.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Timer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timer</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Fade out at end</Text>
            <Switch
              value={fadeOutEnabled}
              onValueChange={setFadeOutEnabled}
              trackColor={{ false: colors.outline, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Premium */}
        {!isPremium && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Premium</Text>
            <View style={styles.premiumCard}>
              <Crown size={24} color={colors.primary} />
              <Text style={styles.premiumTitle}>Unlock DreamTone Premium</Text>
              <Text style={styles.premiumText}>
                30+ sounds, mix up to 4 sounds, unlimited timer, no ads, exclusive sound packs.
              </Text>
              <TouchableOpacity style={styles.premiumButton} onPress={() => setShowPaywall(true)}>
                <Text style={styles.premiumButtonText}>View Plans</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.restoreButton} onPress={restore}>
              <Text style={styles.restoreText}>Restore Purchases</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            DreamTone v1.0.0{'\n'}
            Beautiful sleep sounds for better rest.{'\n'}
            By Abraham Oladotun Foundation.
          </Text>
          <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('https://aofnfp.org/privacy')}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <ExternalLink size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.brandingText}>App by aoftech</Text>
      </ScrollView>
      <Paywall visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </SafeAreaView>
  );
}
