import { describe, expect, it } from 'vitest';

import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';

import { dailyChestCoinReward, getDailyChestState } from './dailyChest';

function createQuest(status: Quest['status']): Quest {
  return {
    coinReward: 3,
    date: '2026-06-16',
    habitId: `habit-${status}`,
    id: `quest-${status}`,
    status,
    title: status,
    xpReward: 10,
  };
}

function createPlayer(selectedClass: Player['selectedClass']): Player {
  return {
    charisma: 1,
    coins: 0,
    createdAt: '2026-06-16T00:00:00.000Z',
    currentXp: 0,
    discipline: 1,
    focus: 1,
    id: 'player-1',
    intelligence: 1,
    level: 1,
    name: 'Thuc',
    selectedClass,
    strength: 1,
    totalXp: 0,
    updatedAt: '2026-06-16T00:00:00.000Z',
    wisdom: 1,
  };
}

describe('getDailyChestState', () => {
  it('locks until every quest for the day is completed', () => {
    expect(
      getDailyChestState(
        '2026-06-16',
        [createQuest('completed'), createQuest('pending')],
        {},
      ),
    ).toEqual({
      coinReward: dailyChestCoinReward,
      completedQuestCount: 1,
      date: '2026-06-16',
      status: 'locked',
      totalQuestCount: 2,
    });
  });

  it('becomes available when all quests are completed', () => {
    expect(
      getDailyChestState(
        '2026-06-16',
        [createQuest('completed'), createQuest('completed')],
        {},
      ).status,
    ).toBe('available');
  });

  it('stays claimed after the daily reward is claimed', () => {
    expect(
      getDailyChestState(
        '2026-06-16',
        [createQuest('completed')],
        { claimedDate: '2026-06-16' },
      ).status,
    ).toBe('claimed');
  });

  it('adds Explorer chest bonus coins', () => {
    expect(
      getDailyChestState(
        '2026-06-16',
        [createQuest('completed')],
        {},
        createPlayer('explorer'),
      ).coinReward,
    ).toBe(dailyChestCoinReward + 5);
  });

  it('keeps the base chest reward for non-Explorer classes', () => {
    expect(
      getDailyChestState(
        '2026-06-16',
        [createQuest('completed')],
        {},
        createPlayer('warrior'),
      ).coinReward,
    ).toBe(dailyChestCoinReward);
  });
});
