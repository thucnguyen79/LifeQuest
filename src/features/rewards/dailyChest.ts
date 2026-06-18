import type { Quest } from '@/data/models/quest';
import type { Player } from '@/data/models/player';
import type { DailyChestRecord } from '@/data/repositories/dailyChestRepository';
import type { DailyBossState } from '@/features/boss/dailyBoss';
import { getDailyChestCoinRewardForClass } from '@/features/classes/classSkills';

export const dailyChestCoinReward = 15;

export type DailyChestStatus = 'available' | 'claimed' | 'locked';

export type DailyChestState = {
  bossBonusCoins: number;
  bossDefeated: boolean;
  coinReward: number;
  completedQuestCount: number;
  date: string;
  status: DailyChestStatus;
  tier: 'boss' | 'daily';
  totalQuestCount: number;
};

export function getDailyChestState(
  date: string,
  quests: Quest[],
  record: DailyChestRecord,
  player?: Player | null,
  boss?: DailyBossState,
): DailyChestState {
  const totalQuestCount = quests.length;
  const completedQuestCount = quests.filter((quest) => quest.status === 'completed').length;
  const allQuestsDone = totalQuestCount > 0 && completedQuestCount === totalQuestCount;
  const status: DailyChestStatus =
    record.claimedDate === date ? 'claimed' : allQuestsDone ? 'available' : 'locked';

  const bossBonusCoins = boss?.status === 'defeated' ? boss.chestBonusCoins : 0;

  return {
    bossBonusCoins,
    bossDefeated: boss?.status === 'defeated',
    coinReward: getDailyChestCoinRewardForClass(dailyChestCoinReward, player) + bossBonusCoins,
    completedQuestCount,
    date,
    status,
    tier: bossBonusCoins > 0 ? 'boss' : 'daily',
    totalQuestCount,
  };
}
