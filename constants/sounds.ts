import { SoundDefinition, SoundCategory } from '@/types';

export const CATEGORY_LABELS: Record<SoundCategory, string> = {
  nature: 'Nature',
  rain: 'Rain',
  water: 'Water',
  white_noise: 'White Noise',
  urban: 'Urban',
};

export const CATEGORY_ORDER: SoundCategory[] = ['nature', 'rain', 'water', 'white_noise', 'urban'];

export const SOUND_CATALOG: SoundDefinition[] = [
  // Nature (5 free + 2 premium)
  { id: 'forest_birds', name: 'Forest Birds', category: 'nature', icon: 'TreePine', premium: false, source: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4dedf5bf94.mp3' },
  { id: 'crickets', name: 'Crickets', category: 'nature', icon: 'Bug', premium: false, source: 'https://cdn.pixabay.com/audio/2022/10/30/audio_f3f304e8bc.mp3' },
  { id: 'wind', name: 'Wind', category: 'nature', icon: 'Wind', premium: false, source: 'https://cdn.pixabay.com/audio/2022/03/24/audio_7a39b10cfa.mp3' },
  { id: 'river', name: 'River', category: 'nature', icon: 'Waves', premium: false, source: 'https://cdn.pixabay.com/audio/2024/11/04/audio_27a975a415.mp3' },
  { id: 'thunderstorm', name: 'Thunderstorm', category: 'nature', icon: 'CloudLightning', premium: false, source: 'https://cdn.pixabay.com/audio/2022/05/31/audio_88eb993cd5.mp3' },
  { id: 'jungle', name: 'Jungle Night', category: 'nature', icon: 'Leaf', premium: true, source: 'https://cdn.pixabay.com/audio/2024/09/20/audio_81774c4a03.mp3' },
  { id: 'owl', name: 'Night Owl', category: 'nature', icon: 'Moon', premium: true, source: 'https://cdn.pixabay.com/audio/2023/07/19/audio_9e1d23f63e.mp3' },

  // Rain (5 free + 2 premium)
  { id: 'light_rain', name: 'Light Rain', category: 'rain', icon: 'CloudDrizzle', premium: false, source: 'https://cdn.pixabay.com/audio/2023/10/07/audio_99e69d1eaa.mp3' },
  { id: 'heavy_rain', name: 'Heavy Rain', category: 'rain', icon: 'CloudRain', premium: false, source: 'https://cdn.pixabay.com/audio/2022/09/06/audio_c41e8eb832.mp3' },
  { id: 'rain_tent', name: 'Rain on Tent', category: 'rain', icon: 'Tent', premium: false, source: 'https://cdn.pixabay.com/audio/2023/02/07/audio_1187cbb0c8.mp3' },
  { id: 'rain_window', name: 'Rain on Window', category: 'rain', icon: 'SquareStack', premium: false, source: 'https://cdn.pixabay.com/audio/2024/02/14/audio_8629db0985.mp3' },
  { id: 'thunder_rain', name: 'Thunder & Rain', category: 'rain', icon: 'Zap', premium: false, source: 'https://cdn.pixabay.com/audio/2022/11/17/audio_2395427a2b.mp3' },
  { id: 'tropical_rain', name: 'Tropical Rain', category: 'rain', icon: 'Palmtree', premium: true, source: 'https://cdn.pixabay.com/audio/2023/08/28/audio_3a06e2ac1c.mp3' },
  { id: 'rain_roof', name: 'Rain on Roof', category: 'rain', icon: 'Home', premium: true, source: 'https://cdn.pixabay.com/audio/2023/11/13/audio_a79dcf5e30.mp3' },

  // Water (3 free + 2 premium)
  { id: 'ocean_waves', name: 'Ocean Waves', category: 'water', icon: 'Waves', premium: false, source: 'https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3' },
  { id: 'waterfall', name: 'Waterfall', category: 'water', icon: 'Droplets', premium: false, source: 'https://cdn.pixabay.com/audio/2024/04/17/audio_d37e2d4cbb.mp3' },
  { id: 'stream', name: 'Babbling Stream', category: 'water', icon: 'Droplet', premium: false, source: 'https://cdn.pixabay.com/audio/2022/08/04/audio_39b661a70b.mp3' },
  { id: 'underwater', name: 'Underwater', category: 'water', icon: 'Fish', premium: true, source: 'https://cdn.pixabay.com/audio/2023/05/10/audio_e3ae0a5fa5.mp3' },
  { id: 'lake', name: 'Lake Shore', category: 'water', icon: 'Sailboat', premium: true, source: 'https://cdn.pixabay.com/audio/2023/03/26/audio_b1c56d43ad.mp3' },

  // White Noise (4 free + 2 premium)
  { id: 'white_noise', name: 'White Noise', category: 'white_noise', icon: 'Radio', premium: false, source: 'https://cdn.pixabay.com/audio/2023/09/08/audio_19efee4b4b.mp3' },
  { id: 'pink_noise', name: 'Pink Noise', category: 'white_noise', icon: 'AudioLines', premium: false, source: 'https://cdn.pixabay.com/audio/2024/01/18/audio_75a1a30886.mp3' },
  { id: 'brown_noise', name: 'Brown Noise', category: 'white_noise', icon: 'AudioWaveform', premium: false, source: 'https://cdn.pixabay.com/audio/2024/03/22/audio_f3e7c91e53.mp3' },
  { id: 'fan', name: 'Fan', category: 'white_noise', icon: 'Fan', premium: false, source: 'https://cdn.pixabay.com/audio/2022/03/09/audio_2fe66bb7bc.mp3' },
  { id: 'airplane', name: 'Airplane Cabin', category: 'white_noise', icon: 'Plane', premium: true, source: 'https://cdn.pixabay.com/audio/2023/04/05/audio_ff2fb29a1f.mp3' },
  { id: 'dryer', name: 'Clothes Dryer', category: 'white_noise', icon: 'Disc', premium: true, source: 'https://cdn.pixabay.com/audio/2024/06/11/audio_2b1a3bb7b3.mp3' },

  // Urban (3 free + 2 premium)
  { id: 'cafe', name: 'Caf\u00e9', category: 'urban', icon: 'Coffee', premium: false, source: 'https://cdn.pixabay.com/audio/2022/10/14/audio_5e0b14b2cb.mp3' },
  { id: 'fireplace', name: 'Fireplace', category: 'urban', icon: 'Flame', premium: false, source: 'https://cdn.pixabay.com/audio/2024/05/13/audio_2e8c8a09d5.mp3' },
  { id: 'train', name: 'Train Journey', category: 'urban', icon: 'TrainFront', premium: false, source: 'https://cdn.pixabay.com/audio/2023/06/22/audio_96e1b1aa08.mp3' },
  { id: 'library', name: 'Library', category: 'urban', icon: 'BookOpen', premium: true, source: 'https://cdn.pixabay.com/audio/2023/12/01/audio_cf0eaa7d83.mp3' },
  { id: 'city_night', name: 'City Night', category: 'urban', icon: 'Building2', premium: true, source: 'https://cdn.pixabay.com/audio/2024/07/19/audio_a1b2c3d4e5.mp3' },
];

export const FREE_SOUND_COUNT = SOUND_CATALOG.filter(s => !s.premium).length;
export const TOTAL_SOUND_COUNT = SOUND_CATALOG.length;
export const MAX_FREE_MIX = 2;
export const MAX_PREMIUM_MIX = 4;
