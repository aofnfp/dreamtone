import { create } from 'zustand';
import { ActiveSound, TimerDuration } from '@/types';
import { SOUND_CATALOG, MAX_FREE_MIX, MAX_PREMIUM_MIX } from '@/constants/sounds';
import { playSound, stopSound, setVolume, fadeOutAll, stopAll } from '@/lib/audio';
import { storage } from '@/lib/storage';

interface SoundStore {
  // Active sounds being played
  activeSounds: ActiveSound[];
  isAnyPlaying: boolean;

  // Timer
  timerDuration: TimerDuration;
  customTimerMinutes: number;
  timerRemainingMs: number;
  timerActive: boolean;
  fadeOutEnabled: boolean;

  // Actions
  toggleSound: (soundId: string, isPremium: boolean) => Promise<void>;
  setSoundVolume: (soundId: string, volume: number) => Promise<void>;
  stopAllSounds: () => Promise<void>;

  // Timer actions
  setTimerDuration: (duration: TimerDuration) => void;
  setCustomTimerMinutes: (minutes: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  timerTick: () => void;
  setFadeOutEnabled: (enabled: boolean) => void;

  // Persistence
  loadFromStorage: () => Promise<void>;
}

let timerInterval: ReturnType<typeof setInterval> | null = null;

export const useSoundStore = create<SoundStore>((set, get) => ({
  activeSounds: [],
  isAnyPlaying: false,
  timerDuration: 30,
  customTimerMinutes: 45,
  timerRemainingMs: 0,
  timerActive: false,
  fadeOutEnabled: true,

  toggleSound: async (soundId: string, isPremium: boolean) => {
    const { activeSounds } = get();
    const isActive = activeSounds.some(s => s.id === soundId);

    if (isActive) {
      await stopSound(soundId);
      const updated = activeSounds.filter(s => s.id !== soundId);
      set({ activeSounds: updated, isAnyPlaying: updated.length > 0 });
      await storage.saveLastMix(updated);
      return;
    }

    // Check mix limit (use MAX_PREMIUM_MIX for now, gate in UI)
    const maxMix = isPremium ? MAX_PREMIUM_MIX : MAX_FREE_MIX;
    if (activeSounds.length >= maxMix) return;

    const soundDef = SOUND_CATALOG.find(s => s.id === soundId);
    if (!soundDef) return;

    const newSound: ActiveSound = { id: soundId, volume: 0.5 };
    await playSound(soundId, soundDef.source, 0.5);
    const updated = [...activeSounds, newSound];
    set({ activeSounds: updated, isAnyPlaying: true });
    await storage.saveLastMix(updated);
  },

  setSoundVolume: async (soundId: string, volume: number) => {
    await setVolume(soundId, volume);
    const { activeSounds } = get();
    const updated = activeSounds.map(s =>
      s.id === soundId ? { ...s, volume } : s
    );
    set({ activeSounds: updated });
    await storage.saveLastMix(updated);
  },

  stopAllSounds: async () => {
    await stopAll();
    set({ activeSounds: [], isAnyPlaying: false });
    const { timerActive } = get();
    if (timerActive) {
      get().stopTimer();
    }
    await storage.saveLastMix([]);
  },

  setTimerDuration: (duration) => set({ timerDuration: duration }),
  setCustomTimerMinutes: (minutes) => set({ customTimerMinutes: minutes }),

  startTimer: () => {
    const { timerDuration, customTimerMinutes } = get();
    if (timerDuration === 'off') return;

    const minutes =
      timerDuration === 'custom' ? customTimerMinutes : timerDuration;
    const ms = minutes * 60 * 1000;

    if (timerInterval) clearInterval(timerInterval);

    set({ timerRemainingMs: ms, timerActive: true });

    timerInterval = setInterval(() => {
      get().timerTick();
    }, 1000);
  },

  stopTimer: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    set({ timerActive: false, timerRemainingMs: 0 });
  },

  timerTick: () => {
    const { timerRemainingMs, fadeOutEnabled } = get();
    const newRemaining = timerRemainingMs - 1000;

    if (newRemaining <= 0) {
      get().stopTimer();
      get().stopAllSounds();
      return;
    }

    // Start fade-out in last 30 seconds
    if (fadeOutEnabled && newRemaining <= 30000 && newRemaining > 29000) {
      fadeOutAll(30000).then(() => {
        get().stopTimer();
        set({ activeSounds: [], isAnyPlaying: false });
      });
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      set({ timerActive: false });
      return;
    }

    set({ timerRemainingMs: newRemaining });
  },

  setFadeOutEnabled: (enabled) => set({ fadeOutEnabled: enabled }),

  loadFromStorage: async () => {
    const settings = await storage.getSettings();
    set({
      fadeOutEnabled: settings.fadeOutEnabled ?? true,
      timerDuration: settings.defaultTimerDuration ?? 30,
    });
  },
}));
