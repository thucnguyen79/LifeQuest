import type { StreakSummary } from './streakSummaryRepository';

const storageKey = 'lifequest.streakSummary';
const defaultStreakSummary: StreakSummary = {
  currentStreak: 0,
  longestStreak: 0,
};
let memorySummary: StreakSummary = defaultStreakSummary;

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function readSummary() {
  const storage = getStorage();

  if (!storage) {
    return memorySummary;
  }

  const value = storage.getItem(storageKey);
  return value ? (JSON.parse(value) as StreakSummary) : defaultStreakSummary;
}

export const streakSummaryRepository = {
  get() {
    return readSummary();
  },

  upsert(summary: StreakSummary) {
    memorySummary = summary;
    getStorage()?.setItem(storageKey, JSON.stringify(summary));
  },

  reset() {
    memorySummary = defaultStreakSummary;
    getStorage()?.removeItem(storageKey);
  },
};
