import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Habit } from '@/data/models/habit';
import type { Quest } from '@/data/models/quest';

const mocks = vi.hoisted(() => ({
  activeHabits: [] as Habit[],
  quests: [] as Quest[],
  markPendingBeforeDateAsMissed: vi.fn((dateKey: string) => {
    mocks.quests = mocks.quests.map((quest) =>
      quest.date < dateKey && quest.status === 'pending'
        ? { ...quest, completedAt: undefined, status: 'missed' }
        : quest,
    );
  }),
  upsert: vi.fn((quest: Quest) => {
    const index = mocks.quests.findIndex((existingQuest) => existingQuest.id === quest.id);

    if (index >= 0) {
      mocks.quests[index] = quest;
      return;
    }

    mocks.quests.push(quest);
  }),
}));

vi.mock('@/data/repositories/habitRepository', () => ({
  habitRepository: {
    listActive: () => mocks.activeHabits,
  },
}));

vi.mock('@/data/repositories/questRepository', () => ({
  questRepository: {
    listByDate: (dateKey: string) =>
      mocks.quests.filter((quest) => quest.date === dateKey),
    markPendingBeforeDateAsMissed: mocks.markPendingBeforeDateAsMissed,
    upsert: mocks.upsert,
  },
}));

import { generateDailyQuests } from './generateDailyQuests';

const createdAt = '2026-06-16T00:00:00.000Z';

function createHabit(overrides: Partial<Habit>): Habit {
  return {
    category: 'fitness',
    createdAt,
    difficulty: 'easy',
    energy: 'medium',
    frequencyType: 'daily',
    id: 'habit-1',
    isActive: true,
    priority: 'normal',
    selectedWeekdays: [],
    title: 'Base habit',
    updatedAt: createdAt,
    ...overrides,
  };
}

describe('generateDailyQuests', () => {
  beforeEach(() => {
    mocks.activeHabits = [];
    mocks.quests = [];
    mocks.markPendingBeforeDateAsMissed.mockClear();
    mocks.upsert.mockClear();
  });

  it('generates due quests with rewards and skips duplicates', () => {
    mocks.activeHabits = [
      createHabit({
        difficulty: 'hard',
        id: 'daily-hard',
        title: 'Train',
      }),
      createHabit({
        difficulty: 'easy',
        frequencyType: 'selectedDays',
        id: 'tuesday-easy',
        selectedWeekdays: [2],
        title: 'Read',
      }),
      createHabit({
        frequencyType: 'selectedDays',
        id: 'wednesday-habit',
        selectedWeekdays: [3],
        title: 'Call friend',
      }),
    ];
    mocks.quests = [
      {
        coinReward: 10,
        date: '2026-06-16',
        habitId: 'daily-hard',
        id: 'quest-daily-hard-2026-06-16',
        targetCount: 1,
        progressCount: 0,
        priority: 'normal',
        energy: 'medium',
        status: 'pending',
        title: 'Train',
        xpReward: 35,
      },
    ];

    const quests = generateDailyQuests('2026-06-16');

    expect(mocks.upsert).toHaveBeenCalledTimes(1);
    expect(mocks.upsert).toHaveBeenCalledWith({
      coinReward: 3,
      date: '2026-06-16',
      habitId: 'tuesday-easy',
      id: 'quest-tuesday-easy-2026-06-16',
      targetCount: 1,
      progressCount: 0,
      priority: 'normal',
      energy: 'medium',
      estimatedMinutes: undefined,
      bonusObjective: undefined,
      bonusCompleted: false,
      status: 'pending',
      title: 'Read',
      xpReward: 10,
    });
    expect(quests.map((quest) => quest.habitId)).toEqual(['daily-hard', 'tuesday-easy']);
  });

  it('marks old pending quests as missed during daily reset', () => {
    mocks.activeHabits = [
      createHabit({
        id: 'today-habit',
        title: 'Today habit',
      }),
    ];
    mocks.quests = [
      {
        coinReward: 3,
        date: '2026-06-15',
        habitId: 'old-habit',
        id: 'quest-old-habit-2026-06-15',
        targetCount: 1,
        progressCount: 0,
        priority: 'normal',
        energy: 'medium',
        status: 'pending',
        title: 'Old habit',
        xpReward: 10,
      },
    ];

    generateDailyQuests('2026-06-16');

    expect(mocks.markPendingBeforeDateAsMissed).toHaveBeenCalledWith('2026-06-16');
    expect(mocks.quests.find((quest) => quest.id === 'quest-old-habit-2026-06-15')?.status).toBe(
      'missed',
    );
  });

  it('copies target count and quest quality metadata from habit', () => {
    mocks.activeHabits = [
      createHabit({
        bonusObjective: 'No phone while reading',
        energy: 'heavy',
        estimatedMinutes: 30,
        id: 'quality-habit',
        priority: 'high',
        targetCount: 3,
        title: 'Read deeply',
      }),
    ];

    const quests = generateDailyQuests('2026-06-16');

    expect(quests[0]).toMatchObject({
      bonusObjective: 'No phone while reading',
      energy: 'heavy',
      estimatedMinutes: 30,
      priority: 'high',
      progressCount: 0,
      targetCount: 3,
    });
  });
});
