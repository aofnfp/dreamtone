import { Platform } from 'react-native';

const REVENUECAT_IOS_KEY = 'appl_REPLACE_WITH_REAL_KEY';
const REVENUECAT_ANDROID_KEY = 'goog_REPLACE_WITH_REAL_KEY';

export const ENTITLEMENT_ID = 'premium';
export const MONTHLY_PRODUCT_ID = 'dreamtone_premium_monthly';
export const ANNUAL_PRODUCT_ID = 'dreamtone_premium_annual';

let Purchases: any = null;

async function loadPurchases() {
  if (Platform.OS === 'web') return;
  try {
    const mod = require('react-native-purchases');
    Purchases = mod.default || mod;
  } catch (e) {
    console.warn('RevenueCat not available:', e);
  }
}

export async function initPurchases(): Promise<void> {
  await loadPurchases();
  if (!Purchases || Platform.OS === 'web') return;

  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;
    await Purchases.configure({ apiKey });
  } catch (e) {
    console.warn('Failed to configure RevenueCat:', e);
  }
}

export async function checkPremiumStatus(): Promise<boolean> {
  if (!Purchases || Platform.OS === 'web') return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    console.warn('Failed to check premium status:', e);
    return false;
  }
}

export async function purchaseMonthly(): Promise<boolean> {
  if (!Purchases) return false;
  try {
    const offerings = await Purchases.getOfferings();
    const monthly = offerings.current?.monthly;
    if (!monthly) return false;
    const { customerInfo } = await Purchases.purchasePackage(monthly);
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    console.warn('Monthly purchase failed:', e);
    return false;
  }
}

export async function purchaseAnnual(): Promise<boolean> {
  if (!Purchases) return false;
  try {
    const offerings = await Purchases.getOfferings();
    const annual = offerings.current?.annual;
    if (!annual) return false;
    const { customerInfo } = await Purchases.purchasePackage(annual);
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    console.warn('Annual purchase failed:', e);
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!Purchases) return false;
  try {
    const info = await Purchases.restorePurchases();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    console.warn('Restore purchases failed:', e);
    return false;
  }
}

export function addPurchaseListener(callback: (info: any) => void): void {
  if (!Purchases) return;
  try {
    Purchases.addCustomerInfoUpdateListener(callback);
  } catch (e) {
    console.warn('Failed to add purchase listener:', e);
  }
}
