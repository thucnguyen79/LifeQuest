import { describe, expect, it } from 'vitest';

import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';
import type { DailyBossState } from '@/features/boss/dailyBoss';

import {
  chestRewardRanges,
  epicChestStreakRequirement,
  getBoundedChestReward,
  getChestRarity,
  getDailyChestState,
  rareChestStreakRequirement,
} from './dailyChest';

function createQuest(status: Quest['status']): Quest {
  return {
    coinReward: 3,
    category: 'fitness',
    date: '2026-06-16',
    energy: 'medium',
    habitId: `habit-${status}`,
    id: `quest-${status}`,
    priority: 'normal',
    progressCount: status === 'completed' ? 1 : 0,
    status,
    targetCount: 1,
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

function createBoss(overrides: Partial<DailyBossState> = {}): DailyBossState {
  return {
    bonusDamage: 0,
    currentHp: 0,
    damage: 20,
    date: '2026-06-16',
    maxHp: 20,
    name: 'Forest Warden',
    status: 'defeated',
    unlocksRareChest: true,
    zoneName: 'Forest of Focus',
    ...overrides,
  };
}

describe('getDailyChestState', () => {
  it('locks until every quest for the day is completed', () => {
    const chest = getDailyChestState(
      '2026-06-16',
      [createQuest('completed'), createQuest('pending')],
      {},
    );

    expect(chest).toMatchObject({
      completedQuestCount: 1,
      status: 'locked',
      tier: 'common',
      totalQuestCount: 2,
    });
  });

  it('becomes available when all quests are completed and stays claimed afterward', () => {
    const quests = [createQuest('completed')];

    expect(getDailyChestState('2026-06-16', quests, {}).status).toBe('available');
    expect(
      getDailyChestState('2026-06-16', quests, { claimedDate: '2026-06-16' }).status,
    ).toBe('claimed');
  });

  it('uses Common, Rare, and Epic conditions', () => {
    expect(getChestRarity(false, rareChestStreakRequirement - 1)).toBe('common');
    expect(getChestRarity(false, rareChestStreakRequirement)).toBe('rare');
    expect(getChestRarity(true, 0)).toBe('rare');
    expect(getChestRarity(true, epicChestStreakRequirement)).toBe('epic');
  });

  it('rolls a stable reward inside each rarity range', () => {
    (['common', 'rare', 'epic'] as const).forEach((rarity) => {
      const first = getBoundedChestReward(rarity, '2026-06-16:player-1');
      const second = getBoundedChestReward(rarity, '2026-06-16:player-1');

      expect(first).toBe(second);
      expect(first).toBeGreaterThanOrEqual(chestRewardRanges[rarity].min);
      expect(first).toBeLessThanOrEqual(chestRewardRanges[rarity].max);
    });
  });

  it('adds the Explorer bonus after the rarity roll', () => {
    const explorerChest = getDailyChestState(
      '2026-06-16',
      [createQuest('completed')],
      {},
      createPlayer('explorer'),
    );

    expect(explorerChest.classBonusCoins).toBe(5);
    expect(explorerChest.coinReward).toBe(explorerChest.rolledCoinReward + 5);
  });

  it('upgrades a defeated boss plus seven-day streak to Epic', () => {
    const chest = getDailyChestState(
      '2026-06-16',
      [createQuest('completed')],
      {},
      createPlayer('warrior'),
      createBoss(),
      epicChestStreakRequirement,
    );

    expect(chest).toMatchObject({
      bossDefeated: true,
      classBonusCoins: 0,
      status: 'available',
      tier: 'epic',
    });
    expect(chest.coinReward).toBeGreaterThanOrEqual(chestRewardRanges.epic.min);
    expect(chest.coinReward).toBeLessThanOrEqual(chestRewardRanges.epic.max);
  });
});
