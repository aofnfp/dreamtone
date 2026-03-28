import { create } from 'zustand';
import {
  checkPremiumStatus,
  purchaseMonthly,
  purchaseAnnual,
  restorePurchases,
  addPurchaseListener,
  ENTITLEMENT_ID,
} from '@/lib/purchases';

interface PremiumStore {
  isPremium: boolean;
  isLoading: boolean;

  loadStatus: () => Promise<void>;
  restore: () => Promise<boolean>;
  buyMonthly: () => Promise<boolean>;
  buyAnnual: () => Promise<boolean>;
  startListening: () => void;
}

export const usePremiumStore = create<PremiumStore>((set) => ({
  isPremium: false,
  isLoading: true,

  loadStatus: async () => {
    set({ isLoading: true });
    const isPremium = await checkPremiumStatus();
    set({ isPremium, isLoading: false });
  },

  restore: async () => {
    set({ isLoading: true });
    const isPremium = await restorePurchases();
    set({ isPremium, isLoading: false });
    return isPremium;
  },

  buyMonthly: async () => {
    set({ isLoading: true });
    const isPremium = await purchaseMonthly();
    set({ isPremium, isLoading: false });
    return isPremium;
  },

  buyAnnual: async () => {
    set({ isLoading: true });
    const isPremium = await purchaseAnnual();
    set({ isPremium, isLoading: false });
    return isPremium;
  },

  startListening: () => {
    addPurchaseListener((info: any) => {
      const isPremium =
        info?.entitlements?.active?.[ENTITLEMENT_ID] !== undefined;
      set({ isPremium });
    });
  },
}));
