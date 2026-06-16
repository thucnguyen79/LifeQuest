import { getDatabase, initializeLocalDatabase } from '@/data/local/database';

export type StreakSummary = {
  currentStreak: number;
  longestStreak: number;
};

const metadataKey = 'streak_summary';
const defaultStreakSummary: StreakSummary = {
  currentStreak: 0,
  longestStreak: 0,
};

export const streakSummaryRepository = {
  get() {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<{ value: string }>(
      'SELECT value FROM app_metadata WHERE key = ?',
      metadataKey,
    );

    return row ? (JSON.parse(row.value) as StreakSummary) : defaultStreakSummary;
  },

  upsert(summary: StreakSummary) {
    initializeLocalDatabase();

    getDatabase().runSync(
      'INSERT OR REPLACE INTO app_metadata (key, value) VALUES (?, ?)',
      metadataKey,
      JSON.stringify(summary),
    );
  },

  reset() {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM app_metadata WHERE key = ?', metadataKey);
  },
};
