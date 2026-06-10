import { getDatabase, initializeLocalDatabase } from '@/data/local/database';
import type {
  Habit,
  HabitCategory,
  HabitDifficulty,
  HabitFrequencyType,
  Weekday,
} from '@/data/models/habit';

type HabitRow = {
  id: string;
  title: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  frequency_type: HabitFrequencyType;
  selected_weekdays: string;
  target_count: number | null;
  reminder_time: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
};

function parseWeekdays(value: string): Weekday[] {
  try {
    return JSON.parse(value) as Weekday[];
  } catch {
    return [];
  }
}

function toHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    difficulty: row.difficulty,
    frequencyType: row.frequency_type,
    selectedWeekdays: parseWeekdays(row.selected_weekdays),
    targetCount: row.target_count ?? undefined,
    reminderTime: row.reminder_time ?? undefined,
    isActive: row.is_active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const habitRepository = {
  list() {
    initializeLocalDatabase();

    return getDatabase()
      .getAllSync<HabitRow>('SELECT * FROM habits ORDER BY created_at ASC')
      .map(toHabit);
  },

  listActive() {
    initializeLocalDatabase();

    return getDatabase()
      .getAllSync<HabitRow>('SELECT * FROM habits WHERE is_active = 1 ORDER BY created_at ASC')
      .map(toHabit);
  },

  getById(id: string) {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<HabitRow>('SELECT * FROM habits WHERE id = ?', id);
    return row ? toHabit(row) : null;
  },

  upsert(habit: Habit) {
    initializeLocalDatabase();

    getDatabase().runSync(
      `
      INSERT OR REPLACE INTO habits (
        id,
        title,
        category,
        difficulty,
        frequency_type,
        selected_weekdays,
        target_count,
        reminder_time,
        is_active,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      habit.id,
      habit.title,
      habit.category,
      habit.difficulty,
      habit.frequencyType,
      JSON.stringify(habit.selectedWeekdays),
      habit.targetCount ?? null,
      habit.reminderTime ?? null,
      habit.isActive ? 1 : 0,
      habit.createdAt,
      habit.updatedAt,
    );
  },

  deactivate(id: string, updatedAt = new Date().toISOString()) {
    initializeLocalDatabase();

    getDatabase().runSync('UPDATE habits SET is_active = 0, updated_at = ? WHERE id = ?', updatedAt, id);
  },

  remove(id: string) {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM habits WHERE id = ?', id);
  },
};
