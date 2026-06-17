import type { Quest } from '@/data/models/quest';
import type { Player } from '@/data/models/player';
import type { DailyChestRecord } from '@/data/repositories/dailyChestRepository';
import { getDailyChestCoinRewardForClass } from '@/features/classes/classSkills';

export const dailyChestCoinReward = 15;

export type DailyChestStatus = 'available' | 'claimed' | 'locked';

export type DailyChestState = {
  coinReward: number;
  completedQuestCount: number;
  date: string;
  status: DailyChestStatus;
  totalQuestCount: number;
};

export function getDailyChestState(
  date: string,
  quests: Quest[],
  record: DailyChestRecord,
  player?: Player | null,
): DailyChestState {
  const totalQuestCount = quests.length;
  const completedQuestCount = quests.filter((quest) => quest.status === 'completed').length;
  const allQuestsDone = totalQuestCount > 0 && completedQuestCount === totalQuestCount;
  const status: DailyChestStatus =
    record.claimedDate === date ? 'claimed' : allQuestsDone ? 'available' : 'locked';

  return {
    coinReward: getDailyChestCoinRewardForClass(dailyChestCoinReward, player),
    completedQuestCount,
    date,
    status,
    totalQuestCount,
  };
}
