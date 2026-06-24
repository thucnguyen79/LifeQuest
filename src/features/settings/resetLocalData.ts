import { getDatabase, initializeLocalDatabase } from '@/data/local/database';

export function resetLocalData() {
  initializeLocalDatabase();

  getDatabase().execSync(`
    DELETE FROM pets;
    DELETE FROM streaks;
    DELETE FROM quests;
    DELETE FROM daily_adventures;
    DELETE FROM habits;
    DELETE FROM players;
    DELETE FROM app_metadata WHERE key = 'streak_summary';
    DELETE FROM app_metadata WHERE key = 'daily_chest';
    DELETE FROM app_metadata WHERE key = 'shop_inventory';
    DELETE FROM app_metadata WHERE key = 'achievement_progress';
  `);
}
