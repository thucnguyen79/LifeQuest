import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';

const mocks = vi.hoisted(() => ({
  playerUpsert: vi.fn(),
  quest: null as Quest | null,
  updateBonusCompleted: vi.fn(),
}));

vi.mock('@/data/repositories/playerRepository', () => ({
  playerRepository: { upsert: mocks.playerUpsert },
}));

vi.mock('@/data/repositories/questRepository', () => ({
  questRepository: {
    getById: () => mocks.quest,
    updateBonusCompleted: mocks.updateBonusCompleted,
  },
}));

import {
  bonusObjectiveCoinReward,
  bonusObjectiveXpReward,
  completeBonusObjective,
} from './completeBonusObjective';

const player: Player = {
  charisma: 1,
  coins: 10,
  createdAt: '2026-06-24T00:00:00.000Z',
  currentXp: 98,
  discipline: 1,
  focus: 1,
  id: 'player-1',
  intelligence: 1,
  level: 1,
  name: 'Thuc',
  selectedClass: 'scholar',
  strength: 1,
  totalXp: 98,
  updatedAt: '2026-06-24T00:00:00.000Z',
  wisdom: 1,
};

function createQuest(overrides: Partial<Quest> = {}): Quest {
  return {
    bonusCompleted: false,
    bonusObjective: 'Read without phone',
    category: 'learning',
    coinReward: 6,
    date: '2026-06-24',
    energy: 'medium',
    habitId: 'habit-1',
    id: 'quest-1',
    priority: 'normal',
    progressCount: 0,
    status: 'pending',
    targetCount: 1,
    title: 'Read',
    xpReward: 20,
    ...overrides,
  };
}

describe('completeBonusObjective', () => {
  beforeEach(() => {
    mocks.quest = createQuest();
    mocks.playerUpsert.mockClear();
    mocks.updateBonusCompleted.mockClear();
  });

  it('grants bounded rewards and can level up without class or stat bonuses', () => {
    const result = completeBonusObjective(player, 'quest-1');

    expect(result).not.toBeNull();
    expect(result?.xpGained).toBe(bonusObjectiveXpReward);
    expect(result?.coinsGained).toBe(bonusObjectiveCoinReward);
    expect(result?.leveledUp).toBe(true);
    expect(result?.player).toMatchObject({
      coins: 12,
      currentXp: 3,
      intelligence: 1,
      discipline: 1,
      level: 2,
      totalXp: 103,
    });
    expect(mocks.updateBonusCompleted).toHaveBeenCalledWith('quest-1', true);
    expect(mocks.playerUpsert).toHaveBeenCalledWith(result?.player);
  });

  it('allows a bonus after the base quest is completed', () => {
    mocks.quest = createQuest({ status: 'completed' });

    expect(completeBonusObjective(player, 'quest-1')).not.toBeNull();
  });

  it('rejects duplicate, missing, and missed bonus objectives', () => {
    mocks.quest = createQuest({ bonusCompleted: true });
    expect(completeBonusObjective(player, 'quest-1')).toBeNull();

    mocks.quest = createQuest({ bonusObjective: undefined });
    expect(completeBonusObjective(player, 'quest-1')).toBeNull();

    mocks.quest = createQuest({ status: 'missed' });
    expect(completeBonusObjective(player, 'quest-1')).toBeNull();
    expect(mocks.updateBonusCompleted).not.toHaveBeenCalled();
  });
});
