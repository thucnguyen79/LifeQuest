import { getDatabase, initializeLocalDatabase } from '@/data/local/database';
import type { HabitCategory } from '@/data/models/habit';
import type { Quest, QuestEnergy, QuestPriority, QuestStatus } from '@/data/models/quest';

type QuestRow = {
  id: string;
  habit_id: string;
  category: HabitCategory;
  title: string;
  date: string;
  xp_reward: number;
  coin_reward: number;
  target_count: number;
  progress_count: number;
  priority: QuestPriority;
  energy: QuestEnergy;
  estimated_minutes: number | null;
  bonus_objective: string | null;
  bonus_completed: number;
  rerolled_at: string | null;
  status: QuestStatus;
  completed_at: string | null;
};

function toQuest(row: QuestRow): Quest {
  return {
    id: row.id,
    habitId: row.habit_id,
    category: row.category ?? 'deepWork',
    title: row.title,
    date: row.date,
    xpReward: row.xp_reward,
    coinReward: row.coin_reward,
    targetCount: row.target_count ?? 1,
    progressCount: row.progress_count ?? 0,
    priority: row.priority ?? 'normal',
    energy: row.energy ?? 'medium',
    estimatedMinutes: row.estimated_minutes ?? undefined,
    bonusObjective: row.bonus_objective ?? undefined,
    bonusCompleted: row.bonus_completed === 1,
    rerolledAt: row.rerolled_at ?? undefined,
    status: row.status,
    completedAt: row.completed_at ?? undefined,
  };
}

export const questRepository = {
  listAll() {
    initializeLocalDatabase();

    return getDatabase()
      .getAllSync<QuestRow>('SELECT * FROM quests ORDER BY date DESC, title ASC')
      .map(toQuest);
  },

  markPendingBeforeDateAsMissed(date: string) {
    initializeLocalDatabase();

    getDatabase().runSync(
      "UPDATE quests SET status = 'missed', completed_at = NULL WHERE date < ? AND status = 'pending'",
      date,
    );
  },

  listByDate(date: string) {
    initializeLocalDatabase();

    return getDatabase()
      .getAllSync<QuestRow>('SELECT * FROM quests WHERE date = ? ORDER BY title ASC', date)
      .map(toQuest);
  },

  getById(id: string) {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<QuestRow>('SELECT * FROM quests WHERE id = ?', id);
    return row ? toQuest(row) : null;
  },

  upsert(quest: Quest) {
    initializeLocalDatabase();

    getDatabase().runSync(
      `
      INSERT OR REPLACE INTO quests (
        id,
        habit_id,
        category,
        title,
        date,
        xp_reward,
        coin_reward,
        target_count,
        progress_count,
        priority,
        energy,
        estimated_minutes,
        bonus_objective,
        bonus_completed,
        rerolled_at,
        status,
        completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      quest.id,
      quest.habitId,
      quest.category,
      quest.title,
      quest.date,
      quest.xpReward,
      quest.coinReward,
      quest.targetCount,
      quest.progressCount,
      quest.priority,
      quest.energy,
      quest.estimatedMinutes ?? null,
      quest.bonusObjective ?? null,
      quest.bonusCompleted ? 1 : 0,
      quest.rerolledAt ?? null,
      quest.status,
      quest.completedAt ?? null,
    );
  },

  updateProgress(id: string, progressCount: number) {
    initializeLocalDatabase();

    getDatabase().runSync('UPDATE quests SET progress_count = ? WHERE id = ?', progressCount, id);
  },

  updateBonusCompleted(id: string, bonusCompleted: boolean) {
    initializeLocalDatabase();

    getDatabase().runSync(
      'UPDATE quests SET bonus_completed = ? WHERE id = ?',
      bonusCompleted ? 1 : 0,
      id,
    );
  },

  updateStatus(id: string, status: QuestStatus, completedAt?: string) {
    initializeLocalDatabase();

    getDatabase().runSync(
      'UPDATE quests SET status = ?, completed_at = ? WHERE id = ?',
      status,
      completedAt ?? null,
      id,
    );
  },

  removeForDate(date: string) {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM quests WHERE date = ?', date);
  },

  remove(id: string) {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM quests WHERE id = ?', id);
  },
};
