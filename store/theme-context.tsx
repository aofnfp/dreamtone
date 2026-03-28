import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from 'react';
import { ThemeColors, Theme } from '@/types';
import { themes, defaultThemeId, getThemeById } from '@/constants/themes';
import { storage } from '@/lib/storage';

interface ThemeContextValue {
  theme: Theme;
  colors: ThemeColors;
  allThemes: Theme[];
  applyTheme: (themeId: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getThemeById(defaultThemeId));

  useEffect(() => {
    storage.getThemeId().then(id => {
      if (id) setTheme(getThemeById(id));
    });
  }, []);

  const applyTheme = useCallback(async (themeId: string) => {
    const t = getThemeById(themeId);
    setTheme(t);
    await storage.saveThemeId(themeId);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      colors: theme.colors,
      allThemes: themes,
      applyTheme,
    }),
    [theme, applyTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
