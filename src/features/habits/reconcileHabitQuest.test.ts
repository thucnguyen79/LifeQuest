import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Habit } from '@/data/models/habit';
import type { Quest } from '@/data/models/quest';

const mocks = vi.hoisted(() => ({
  questById: null as Quest | null,
  remove: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock('@/data/repositories/questRepository', () => ({
  questRepository: {
    getById: () => mocks.questById,
    remove: mocks.remove,
    upsert: mocks.upsert,
  },
}));

import { reconcileHabitQuestForDate } from './reconcileHabitQuest';

const now = '2026-06-16T00:00:00.000Z';

function createHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    category: 'learning',
    createdAt: now,
    difficulty: 'easy',
    frequencyType: 'daily',
    id: 'habit-1',
    isActive: true,
    selectedWeekdays: [],
    title: 'Read',
    updatedAt: now,
    ...overrides,
  };
}

function createQuest(overrides: Partial<Quest> = {}): Quest {
  return {
    coinReward: 3,
    date: '2026-06-16',
    habitId: 'habit-1',
    id: 'quest-habit-1-2026-06-16',
    status: 'pending',
    title: 'Read',
    xpReward: 10,
    ...overrides,
  };
}

describe('reconcileHabitQuestForDate', () => {
  beforeEach(() => {
    mocks.questById = null;
    mocks.remove.mockClear();
    mocks.upsert.mockClear();
  });

  it('updates today pending quest when habit title or difficulty changes', () => {
    mocks.questById = createQuest();

    const result = reconcileHabitQuestForDate(
      createHabit({
        difficulty: 'hard',
        title: 'Read 40 minutes',
      }),
      '2026-06-16',
    );

    expect(result).toEqual({
      coinReward: 10,
      date: '2026-06-16',
      habitId: 'habit-1',
      id: 'quest-habit-1-2026-06-16',
      status: 'pending',
      title: 'Read 40 minutes',
      xpReward: 35,
    });
    expect(mocks.upsert).toHaveBeenCalledWith(result);
    expect(mocks.remove).not.toHaveBeenCalled();
  });

  it('does not mutate completed quests', () => {
    const completedQuest = createQuest({
      completedAt: '2026-06-16T01:00:00.000Z',
      status: 'completed',
    });
    mocks.questById = completedQuest;

    const result = reconcileHabitQuestForDate(
      createHabit({
        difficulty: 'hard',
        title: 'Read 40 minutes',
      }),
      '2026-06-16',
    );

    expect(result).toBe(completedQuest);
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.remove).not.toHaveBeenCalled();
  });

  it('removes today pending quest when selected weekdays no longer include today', () => {
    mocks.questById = createQuest();

    const result = reconcileHabitQuestForDate(
      createHabit({
        frequencyType: 'selectedDays',
        selectedWeekdays: [3],
      }),
      '2026-06-16',
    );

    expect(result).toBeNull();
    expect(mocks.remove).toHaveBeenCalledWith('quest-habit-1-2026-06-16');
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  it('removes today pending quest when habit is archived', () => {
    mocks.questById = createQuest();

    const result = reconcileHabitQuestForDate(
      createHabit({
        isActive: false,
      }),
      '2026-06-16',
    );

    expect(result).toBeNull();
    expect(mocks.remove).toHaveBeenCalledWith('quest-habit-1-2026-06-16');
  });
});
