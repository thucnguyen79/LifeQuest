import { getDatabase, initializeLocalDatabase } from '@/data/local/database';
import type { AdventureZoneId, DailyAdventure } from '@/data/models/adventure';

type DailyAdventureRow = {
  date: string;
  zone_id: AdventureZoneId;
  node_progress: number;
  node_target: number;
  cleared: number;
  updated_at: string;
};

function toDailyAdventure(row: DailyAdventureRow): DailyAdventure {
  return {
    date: row.date,
    zoneId: row.zone_id,
    nodeProgress: row.node_progress,
    nodeTarget: row.node_target,
    cleared: row.cleared === 1,
    updatedAt: row.updated_at,
  };
}

export const dailyAdventureRepository = {
  getByDate(date: string) {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<DailyAdventureRow>(
      'SELECT * FROM daily_adventures WHERE date = ?',
      date,
    );
    return row ? toDailyAdventure(row) : null;
  },

  upsert(adventure: DailyAdventure) {
    initializeLocalDatabase();

    getDatabase().runSync(
      `
      INSERT OR REPLACE INTO daily_adventures (
        date,
        zone_id,
        node_progress,
        node_target,
        cleared,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      adventure.date,
      adventure.zoneId,
      adventure.nodeProgress,
      adventure.nodeTarget,
      adventure.cleared ? 1 : 0,
      adventure.updatedAt,
    );
  },

  reset() {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM daily_adventures');
  },
};
