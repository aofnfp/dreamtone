// Sound system
export type SoundCategory = 'nature' | 'rain' | 'water' | 'white_noise' | 'urban';

export interface SoundDefinition {
  id: string;
  name: string;
  category: SoundCategory;
  icon: string; // lucide icon name
  premium: boolean;
  source: string; // URL to audio file
}

export interface ActiveSound {
  id: string;
  volume: number; // 0-1
}

export interface SoundMix {
  id: string;
  name: string;
  sounds: ActiveSound[];
  createdAt: string; // ISO
}

// Timer
export type TimerDuration = 15 | 30 | 45 | 60 | 90 | 'custom' | 'off';

export interface TimerState {
  duration: TimerDuration;
  customMinutes: number;
  remainingMs: number;
  isActive: boolean;
  fadeOut: boolean; // gentle fade in last 30s
}

// Theme
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  primaryMuted: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  warning: string;
  danger: string;
  outline: string;
  overlay: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

// Settings
export interface AppSettings {
  themeId: string;
  defaultTimerDuration: TimerDuration;
  fadeOutEnabled: boolean;
  hapticFeedback: boolean;
}
