import { create } from 'zustand';
import { SoundMix, ActiveSound } from '@/types';
import { storage } from '@/lib/storage';

interface FavoritesStore {
  favorites: SoundMix[];
  isLoaded: boolean;

  loadFavorites: () => Promise<void>;
  saveMix: (name: string, sounds: ActiveSound[]) => Promise<void>;
  deleteMix: (id: string) => Promise<void>;
  renameMix: (id: string, name: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],
  isLoaded: false,

  loadFavorites: async () => {
    const favorites = await storage.getFavorites();
    set({ favorites, isLoaded: true });
  },

  saveMix: async (name: string, sounds: ActiveSound[]) => {
    const mix: SoundMix = {
      id:
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 6),
      name,
      sounds: [...sounds],
      createdAt: new Date().toISOString(),
    };
    const favorites = [...get().favorites, mix];
    set({ favorites });
    await storage.saveFavorites(favorites);
  },

  deleteMix: async (id: string) => {
    const favorites = get().favorites.filter(f => f.id !== id);
    set({ favorites });
    await storage.saveFavorites(favorites);
  },

  renameMix: async (id: string, name: string) => {
    const favorites = get().favorites.map(f =>
      f.id === id ? { ...f, name } : f
    );
    set({ favorites });
    await storage.saveFavorites(favorites);
  },
}));
