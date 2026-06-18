import type { DailyAdventure } from '@/data/models/adventure';

const storageKey = 'lifequest.dailyAdventures';
let memoryAdventures: DailyAdventure[] = [];

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function readAdventures() {
  const storage = getStorage();

  if (!storage) {
    return memoryAdventures;
  }

  const value = storage.getItem(storageKey);
  return value ? (JSON.parse(value) as DailyAdventure[]) : [];
}

function writeAdventures(adventures: DailyAdventure[]) {
  memoryAdventures = adventures;
  getStorage()?.setItem(storageKey, JSON.stringify(adventures));
}

export const dailyAdventureRepository = {
  getByDate(date: string) {
    return readAdventures().find((adventure) => adventure.date === date) ?? null;
  },

  upsert(adventure: DailyAdventure) {
    const adventures = readAdventures();
    const nextAdventures = adventures.some((item) => item.date === adventure.date)
      ? adventures.map((item) => (item.date === adventure.date ? adventure : item))
      : [...adventures, adventure];

    writeAdventures(nextAdventures);
  },

  reset() {
    writeAdventures([]);
  },
};
