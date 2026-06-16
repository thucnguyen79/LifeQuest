import { getDatabase, initializeLocalDatabase } from '@/data/local/database';

export type DailyChestRecord = {
  claimedDate?: string;
};

const metadataKey = 'daily_chest';
const defaultRecord: DailyChestRecord = {};

export const dailyChestRepository = {
  get() {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<{ value: string }>(
      'SELECT value FROM app_metadata WHERE key = ?',
      metadataKey,
    );

    return row ? (JSON.parse(row.value) as DailyChestRecord) : defaultRecord;
  },

  claim(dateKey: string) {
    initializeLocalDatabase();

    const record: DailyChestRecord = {
      claimedDate: dateKey,
    };

    getDatabase().runSync(
      'INSERT OR REPLACE INTO app_metadata (key, value) VALUES (?, ?)',
      metadataKey,
      JSON.stringify(record),
    );

    return record;
  },

  reset() {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM app_metadata WHERE key = ?', metadataKey);
  },
};
