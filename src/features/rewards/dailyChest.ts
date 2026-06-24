import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';
import type { DailyChestRecord } from '@/data/repositories/dailyChestRepository';
import type { DailyBossState } from '@/features/boss/dailyBoss';
import { getDailyChestCoinRewardForClass } from '@/features/classes/classSkills';

export const dailyChestCoinReward = 15;
export const rareChestStreakRequirement = 3;
export const epicChestStreakRequirement = 7;

export type ChestRarity = 'common' | 'epic' | 'rare';
export type DailyChestStatus = 'available' | 'claimed' | 'locked';

export const chestRewardRanges: Record<ChestRarity, { max: number; min: number }> = {
  common: { min: dailyChestCoinReward, max: 18 },
  rare: { min: 25, max: 30 },
  epic: { min: 40, max: 48 },
};

export const chestRarityLabels: Record<ChestRarity, string> = {
  common: 'Common',
  epic: 'Epic',
  rare: 'Rare',
};

export type DailyChestState = {
  bossDefeated: boolean;
  classBonusCoins: number;
  coinReward: number;
  completedQuestCount: number;
  date: string;
  nextTierHint: string;
  rarityReason: string;
  rewardMax: number;
  rewardMin: number;
  rolledCoinReward: number;
  status: DailyChestStatus;
  tier: ChestRarity;
  totalQuestCount: number;
};

function hashSeed(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function getBoundedChestReward(rarity: ChestRarity, seed: string) {
  const range = chestRewardRanges[rarity];
  return range.min + (hashSeed(seed) % (range.max - range.min + 1));
}

export function getChestRarity(bossDefeated: boolean, currentStreak: number): ChestRarity {
  if (bossDefeated && currentStreak >= epicChestStreakRequirement) {
    return 'epic';
  }

  if (bossDefeated || currentStreak >= rareChestStreakRequirement) {
    return 'rare';
  }

  return 'common';
}

function getRarityCopy(rarity: ChestRarity, bossDefeated: boolean) {
  if (rarity === 'epic') {
    return {
      nextTierHint: 'Highest chest tier reached.',
      rarityReason: `Boss defeated with a ${epicChestStreakRequirement}-day streak.`,
    };
  }

  if (rarity === 'rare') {
    return {
      nextTierHint: `Defeat the boss with a ${epicChestStreakRequirement}-day streak for Epic.`,
      rarityReason: bossDefeated
        ? 'Daily boss defeated.'
        : `${rareChestStreakRequirement}-day streak reached.`,
    };
  }

  return {
    nextTierHint: `Defeat the boss or reach a ${rareChestStreakRequirement}-day streak for Rare.`,
    rarityReason: 'Daily quest clear reward.',
  };
}

export function getDailyChestState(
  date: string,
  quests: Quest[],
  record: DailyChestRecord,
  player?: Player | null,
  boss?: DailyBossState,
  currentStreak = 0,
): DailyChestState {
  const totalQuestCount = quests.length;
  const completedQuestCount = quests.filter((quest) => quest.status === 'completed').length;
  const allQuestsDone = totalQuestCount > 0 && completedQuestCount === totalQuestCount;
  const status: DailyChestStatus =
    record.claimedDate === date ? 'claimed' : allQuestsDone ? 'available' : 'locked';
  const bossDefeated = boss?.unlocksRareChest ?? false;
  const tier = getChestRarity(bossDefeated, currentStreak);
  const rewardRange = chestRewardRanges[tier];
  const rolledCoinReward = getBoundedChestReward(
    tier,
    `${date}:${player?.id ?? 'guest'}:${tier}`,
  );
  const coinReward = getDailyChestCoinRewardForClass(rolledCoinReward, player);
  const rarityCopy = getRarityCopy(tier, bossDefeated);

  return {
    bossDefeated,
    classBonusCoins: coinReward - rolledCoinReward,
    coinReward,
    completedQuestCount,
    date,
    ...rarityCopy,
    rewardMax: rewardRange.max,
    rewardMin: rewardRange.min,
    rolledCoinReward,
    status,
    tier,
    totalQuestCount,
  };
}
