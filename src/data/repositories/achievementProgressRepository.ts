import { getDatabase, initializeLocalDatabase } from '@/data/local/database';
import {
  defaultAchievementProgress,
  normalizeAchievementProgress,
  type AchievementProgressRecord,
} from '@/features/achievements/achievements';

const metadataKey = 'achievement_progress';

export const achievementProgressRepository = {
  get() {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<{ value: string }>(
      'SELECT value FROM app_metadata WHERE key = ?',
      metadataKey,
    );

    return row
      ? normalizeAchievementProgress(JSON.parse(row.value) as Partial<AchievementProgressRecord>)
      : defaultAchievementProgress;
  },

  upsert(record: AchievementProgressRecord) {
    initializeLocalDatabase();

    getDatabase().runSync(
      'INSERT OR REPLACE INTO app_metadata (key, value) VALUES (?, ?)',
      metadataKey,
      JSON.stringify(record),
    );
  },

  reset() {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM app_metadata WHERE key = ?', metadataKey);
  },
};
