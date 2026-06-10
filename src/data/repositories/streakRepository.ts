import { getDatabase, initializeLocalDatabase } from '@/data/local/database';
import type { Streak } from '@/data/models/streak';

type StreakRow = {
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
};

function toStreak(row: StreakRow): Streak {
  return {
    habitId: row.habit_id,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    lastCompletedDate: row.last_completed_date ?? undefined,
  };
}

export const streakRepository = {
  list() {
    initializeLocalDatabase();

    return getDatabase()
      .getAllSync<StreakRow>('SELECT * FROM streaks ORDER BY habit_id ASC')
      .map(toStreak);
  },

  getByHabitId(habitId: string) {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<StreakRow>(
      'SELECT * FROM streaks WHERE habit_id = ?',
      habitId,
    );
    return row ? toStreak(row) : null;
  },

  upsert(streak: Streak) {
    initializeLocalDatabase();

    getDatabase().runSync(
      `
      INSERT OR REPLACE INTO streaks (
        habit_id,
        current_streak,
        longest_streak,
        last_completed_date
      ) VALUES (?, ?, ?, ?)
      `,
      streak.habitId,
      streak.currentStreak,
      streak.longestStreak,
      streak.lastCompletedDate ?? null,
    );
  },

  remove(habitId: string) {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM streaks WHERE habit_id = ?', habitId);
  },
};
