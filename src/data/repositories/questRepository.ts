import { getDatabase, initializeLocalDatabase } from '@/data/local/database';
import type { Quest, QuestStatus } from '@/data/models/quest';

type QuestRow = {
  id: string;
  habit_id: string;
  title: string;
  date: string;
  xp_reward: number;
  coin_reward: number;
  status: QuestStatus;
  completed_at: string | null;
};

function toQuest(row: QuestRow): Quest {
  return {
    id: row.id,
    habitId: row.habit_id,
    title: row.title,
    date: row.date,
    xpReward: row.xp_reward,
    coinReward: row.coin_reward,
    status: row.status,
    completedAt: row.completed_at ?? undefined,
  };
}

export const questRepository = {
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
        title,
        date,
        xp_reward,
        coin_reward,
        status,
        completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      quest.id,
      quest.habitId,
      quest.title,
      quest.date,
      quest.xpReward,
      quest.coinReward,
      quest.status,
      quest.completedAt ?? null,
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
};
