import { Theme, ThemeColors } from '@/types';

const darkColors: ThemeColors = {
  background: '#0A0E1A',
  surface: '#141929',
  surfaceElevated: '#1C2237',
  primary: '#7C8CF8',
  primaryMuted: 'rgba(124, 140, 248, 0.15)',
  accent: '#A78BFA',
  textPrimary: '#E8EAF0',
  textSecondary: '#8B90B0',
  textMuted: '#5A5F7D',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  outline: '#252A40',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

const lightColors: ThemeColors = {
  background: '#F5F6FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  primary: '#5B6AE8',
  primaryMuted: 'rgba(91, 106, 232, 0.1)',
  accent: '#8B5CF6',
  textPrimary: '#1A1D2E',
  textSecondary: '#6B7094',
  textMuted: '#9CA0B8',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  outline: '#E2E4EC',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const themes: Theme[] = [
  { id: 'dark', name: 'Midnight', colors: darkColors },
  { id: 'light', name: 'Dawn', colors: lightColors },
];

export const defaultThemeId = 'dark';

export function getThemeById(id: string): Theme {
  return themes.find(t => t.id === id) || themes[0];
}
