import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Habit } from '@/data/models/habit';
import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';

const mocks = vi.hoisted(() => ({
  habitById: undefined as Habit | undefined,
  playerUpsert: vi.fn(),
  questById: undefined as Quest | undefined,
  updateStatus: vi.fn(),
}));

vi.mock('@/data/repositories/habitRepository', () => ({
  habitRepository: {
    getById: () => mocks.habitById,
  },
}));

vi.mock('@/data/repositories/playerRepository', () => ({
  playerRepository: {
    upsert: mocks.playerUpsert,
  },
}));

vi.mock('@/data/repositories/questRepository', () => ({
  questRepository: {
    getById: () => mocks.questById,
    updateStatus: mocks.updateStatus,
  },
}));

import { completeQuest } from './completeQuest';

const now = '2026-06-16T00:00:00.000Z';

function createPlayer(overrides: Partial<Player> = {}): Player {
  return {
    charisma: 1,
    coins: 4,
    createdAt: now,
    currentXp: 90,
    discipline: 1,
    focus: 1,
    id: 'player-1',
    intelligence: 1,
    level: 1,
    name: 'Thuc',
    selectedClass: 'explorer',
    strength: 1,
    totalXp: 90,
    updatedAt: now,
    wisdom: 1,
    ...overrides,
  };
}

function createHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    category: 'learning',
    createdAt: now,
    difficulty: 'medium',
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
    coinReward: 6,
    date: '2026-06-16',
    habitId: 'habit-1',
    id: 'quest-1',
    status: 'pending',
    title: 'Read',
    xpReward: 20,
    ...overrides,
  };
}

describe('completeQuest', () => {
  beforeEach(() => {
    mocks.habitById = undefined;
    mocks.questById = undefined;
    mocks.playerUpsert.mockClear();
    mocks.updateStatus.mockClear();
  });

  it('applies XP, coins, level-up, discipline, and mapped stat rewards', () => {
    const player = createPlayer();
    mocks.habitById = createHabit();
    mocks.questById = createQuest();

    const result = completeQuest(player, 'quest-1');

    expect(result).not.toBeNull();
    expect(result?.leveledUp).toBe(true);
    expect(result?.previousLevel).toBe(1);
    expect(result?.newLevel).toBe(2);
    expect(result?.player).toEqual({
      ...player,
      coins: 10,
      currentXp: 10,
      discipline: 2,
      intelligence: 2,
      level: 2,
      totalXp: 110,
      updatedAt: expect.any(String),
    });
    expect(result?.quest.status).toBe('completed');
    expect(result?.quest.completedAt).toEqual(expect.any(String));
    expect(mocks.updateStatus).toHaveBeenCalledWith(
      'quest-1',
      'completed',
      expect.any(String),
    );
    expect(mocks.playerUpsert).toHaveBeenCalledWith(result?.player);
  });

  it('does not reward quests that are already completed', () => {
    mocks.habitById = createHabit();
    mocks.questById = createQuest({ status: 'completed' });

    const result = completeQuest(createPlayer(), 'quest-1');

    expect(result).toBeNull();
    expect(mocks.updateStatus).not.toHaveBeenCalled();
    expect(mocks.playerUpsert).not.toHaveBeenCalled();
  });
});
