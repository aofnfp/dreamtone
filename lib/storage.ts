import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAVORITES: 'dt.favorites',
  SETTINGS: 'dt.settings',
  THEME_ID: 'dt.theme_id',
  LAST_MIX: 'dt.last_mix',
} as const;

async function getJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && !Array.isArray(parsed) && typeof fallback === 'object' && !Array.isArray(fallback)) {
      return { ...(fallback as object), ...parsed } as T;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

async function setJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (__DEV__) console.warn('Storage write failed:', e);
  }
}

export const storage = {
  // Favorites (saved mixes)
  getFavorites: () => getJSON<any[]>(KEYS.FAVORITES, []),
  saveFavorites: (favs: any[]) => setJSON(KEYS.FAVORITES, favs),

  // Theme
  getThemeId: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(KEYS.THEME_ID);
    } catch {
      return null;
    }
  },
  saveThemeId: (id: string) => AsyncStorage.setItem(KEYS.THEME_ID, id).catch(() => {}),

  // Settings
  getSettings: () => getJSON(KEYS.SETTINGS, {
    defaultTimerDuration: 30 as const,
    fadeOutEnabled: true,
    hapticFeedback: true,
  }),
  saveSettings: (settings: any) => setJSON(KEYS.SETTINGS, settings),

  // Last active mix (restore on app open)
  getLastMix: () => getJSON<any[]>(KEYS.LAST_MIX, []),
  saveLastMix: (mix: any[]) => setJSON(KEYS.LAST_MIX, mix),

  // Clear all
  clearAll: async () => {
    const keys = Object.values(KEYS);
    await Promise.all(keys.map(k => AsyncStorage.removeItem(k).catch(() => {})));
  },
};
