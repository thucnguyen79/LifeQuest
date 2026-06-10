import type { Player } from '@/data/models/player';

const storageKey = 'lifequest.player';
let memoryPlayer: Player | null = null;

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function readPlayer() {
  const storage = getStorage();

  if (!storage) {
    return memoryPlayer;
  }

  const value = storage.getItem(storageKey);
  return value ? (JSON.parse(value) as Player) : null;
}

export const playerRepository = {
  getById(id: string) {
    const player = readPlayer();
    return player?.id === id ? player : null;
  },

  getCurrent() {
    return readPlayer();
  },

  upsert(player: Player) {
    memoryPlayer = player;

    const storage = getStorage();
    storage?.setItem(storageKey, JSON.stringify(player));
  },

  remove(id: string) {
    const player = readPlayer();

    if (player?.id !== id) {
      return;
    }

    memoryPlayer = null;
    getStorage()?.removeItem(storageKey);
  },
};
