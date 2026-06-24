import {
  defaultAchievementProgress,
  normalizeAchievementProgress,
  type AchievementProgressRecord,
} from '@/features/achievements/achievements';

const storageKey = 'lifequest.achievementProgress';
let memoryRecord: AchievementProgressRecord = defaultAchievementProgress;

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export const achievementProgressRepository = {
  get() {
    const value = getStorage()?.getItem(storageKey);
    return value
      ? normalizeAchievementProgress(JSON.parse(value) as Partial<AchievementProgressRecord>)
      : memoryRecord;
  },

  upsert(record: AchievementProgressRecord) {
    memoryRecord = record;
    getStorage()?.setItem(storageKey, JSON.stringify(record));
  },

  reset() {
    memoryRecord = defaultAchievementProgress;
    getStorage()?.removeItem(storageKey);
  },
};
