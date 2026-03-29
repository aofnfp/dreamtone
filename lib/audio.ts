import { Audio } from 'expo-av';

const activeSounds: Map<string, Audio.Sound> = new Map();

export async function initAudio() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    shouldDuckAndroid: true,
  });
}

export async function playSound(soundId: string, source: string, volume: number = 0.5): Promise<void> {
  // If already playing, just update volume
  if (activeSounds.has(soundId)) {
    const existing = activeSounds.get(soundId)!;
    await existing.setVolumeAsync(volume);
    return;
  }

  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: source },
      { shouldPlay: true, volume, isLooping: true }
    );
    activeSounds.set(soundId, sound);
  } catch (e) {
    if (__DEV__) console.warn(`Failed to play sound ${soundId}:`, e);
  }
}

export async function stopSound(soundId: string): Promise<void> {
  const sound = activeSounds.get(soundId);
  if (sound) {
    try {
      await sound.stopAsync();
      await sound.unloadAsync();
    } catch (e) {
      if (__DEV__) console.warn(`Failed to stop sound ${soundId}:`, e);
    }
    activeSounds.delete(soundId);
  }
}

export async function setVolume(soundId: string, volume: number): Promise<void> {
  const sound = activeSounds.get(soundId);
  if (sound) {
    try {
      await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    } catch (e) {
      if (__DEV__) console.warn(`Failed to set volume for ${soundId}:`, e);
    }
  }
}

export async function fadeOutAll(durationMs: number = 30000): Promise<void> {
  const steps = 30;
  const interval = durationMs / steps;

  // Get current volumes
  const volumes: Map<string, number> = new Map();
  for (const [id, sound] of activeSounds) {
    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        volumes.set(id, status.volume);
      }
    } catch (e) {
      // ignore
    }
  }

  for (let i = steps; i >= 0; i--) {
    const factor = i / steps;
    for (const [id, baseVolume] of volumes) {
      const sound = activeSounds.get(id);
      if (sound) {
        try {
          await sound.setVolumeAsync(baseVolume * factor);
        } catch (e) {
          // ignore
        }
      }
    }
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  await stopAll();
}

export async function stopAll(): Promise<void> {
  const ids = Array.from(activeSounds.keys());
  await Promise.all(ids.map(id => stopSound(id)));
}

export function getActiveCount(): number {
  return activeSounds.size;
}

export function isPlaying(soundId: string): boolean {
  return activeSounds.has(soundId);
}

export async function cleanup(): Promise<void> {
  await stopAll();
}
