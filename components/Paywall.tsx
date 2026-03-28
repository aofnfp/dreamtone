import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { X, Crown, Check } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';
import { usePremiumStore } from '@/store/premium-store';

interface PaywallProps {
  visible: boolean;
  onClose: () => void;
}

const FEATURES = [
  '30+ premium sounds',
  'Mix up to 4 sounds',
  'Unlimited sleep timer',
  'Ad-free experience',
  'Exclusive sound packs',
];

export default function Paywall({ visible, onClose }: PaywallProps) {
  const { colors } = useTheme();
  const { buyMonthly, buyAnnual, restore, isLoading } = usePremiumStore();
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual');

  const handlePurchase = useCallback(async () => {
    const success = plan === 'annual' ? await buyAnnual() : await buyMonthly();
    if (success) {
      Alert.alert('Welcome!', 'You now have DreamTone Premium.', [{ text: 'OK', onPress: onClose }]);
    }
  }, [plan, buyAnnual, buyMonthly, onClose]);

  const handleRestore = useCallback(async () => {
    const success = await restore();
    if (success) {
      Alert.alert('Restored!', 'Your premium access has been restored.', [{ text: 'OK', onPress: onClose }]);
    } else {
      Alert.alert('No purchases found', 'No previous purchases were found for this account.');
    }
  }, [restore, onClose]);

  const styles = useMemo(() => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
    sheet: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    closeButton: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
    header: { alignItems: 'center', marginBottom: 24 },
    crownIcon: { marginBottom: 12 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
    headerSub: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    features: { marginBottom: 24 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    featureText: { fontSize: 14, color: colors.textPrimary },
    plans: { gap: 12, marginBottom: 24 },
    planCard: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2 },
    planLeft: {},
    planName: { fontSize: 16, fontWeight: '700' },
    planPrice: { fontSize: 13, marginTop: 2 },
    planBadge: { backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
    planBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
    purchaseButton: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
    purchaseText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    restoreButton: { alignItems: 'center', marginTop: 16 },
    restoreText: { fontSize: 13, color: colors.textMuted },
  }), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Crown size={40} color={colors.accent} style={styles.crownIcon} />
            <Text style={styles.headerTitle}>DreamTone Premium</Text>
            <Text style={styles.headerSub}>Unlock the full experience</Text>
          </View>

          <View style={styles.features}>
            {FEATURES.map(f => (
              <View key={f} style={styles.featureRow}>
                <Check size={18} color={colors.success} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <View style={styles.plans}>
            <TouchableOpacity
              style={[styles.planCard, {
                backgroundColor: plan === 'annual' ? colors.primaryMuted : colors.surface,
                borderColor: plan === 'annual' ? colors.primary : colors.outline,
              }]}
              onPress={() => setPlan('annual')}
            >
              <View style={styles.planLeft}>
                <Text style={[styles.planName, { color: plan === 'annual' ? colors.primary : colors.textPrimary }]}>Annual</Text>
                <Text style={[styles.planPrice, { color: plan === 'annual' ? colors.primary : colors.textSecondary }]}>$24.99/year ($2.08/mo)</Text>
              </View>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>SAVE 48%</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.planCard, {
                backgroundColor: plan === 'monthly' ? colors.primaryMuted : colors.surface,
                borderColor: plan === 'monthly' ? colors.primary : colors.outline,
              }]}
              onPress={() => setPlan('monthly')}
            >
              <View style={styles.planLeft}>
                <Text style={[styles.planName, { color: plan === 'monthly' ? colors.primary : colors.textPrimary }]}>Monthly</Text>
                <Text style={[styles.planPrice, { color: plan === 'monthly' ? colors.primary : colors.textSecondary }]}>$3.99/month</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.purchaseText}>Continue</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
