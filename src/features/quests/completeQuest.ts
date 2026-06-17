import { calculateLevel, statByHabitCategory } from '@/core/constants/gameRules';
import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';
import { habitRepository } from '@/data/repositories/habitRepository';
import { playerRepository } from '@/data/repositories/playerRepository';
import { questRepository } from '@/data/repositories/questRepository';
import { getClassRewardModifiers } from '@/features/classes/classSkills';

type CompleteQuestResult = {
  classBonusLabels: string[];
  coinsGained: number;
  player: Player;
  quest: Quest;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  xpGained: number;
};

function applyQuestRewards(player: Player, quest: Quest): {
  classBonusLabels: string[];
  coinsGained: number;
  player: Player;
  xpGained: number;
} {
  const habit = habitRepository.getById(quest.habitId);
  const classModifiers = getClassRewardModifiers(player, quest, habit);
  const xpGained = quest.xpReward + classModifiers.bonusXp;
  const coinsGained = quest.coinReward + classModifiers.bonusCoins;
  const totalXp = player.totalXp + xpGained;
  const statKey = habit ? statByHabitCategory[habit.category] : null;

  return {
    classBonusLabels: classModifiers.labels,
    coinsGained,
    xpGained,
    player: {
      ...player,
      level: calculateLevel(totalXp),
      currentXp: totalXp % 100,
      totalXp,
      coins: player.coins + coinsGained,
      discipline: player.discipline + 1,
      ...(statKey ? { [statKey]: player[statKey] + 1 } : {}),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function completeQuest(player: Player, questId: string): CompleteQuestResult | null {
  const quest = questRepository.getById(questId);

  if (!quest || quest.status !== 'pending') {
    return null;
  }

  const completedAt = new Date().toISOString();
  const completedQuest: Quest = {
    ...quest,
    status: 'completed',
    completedAt,
  };
  const rewardResult = applyQuestRewards(player, quest);

  questRepository.updateStatus(quest.id, 'completed', completedAt);
  playerRepository.upsert(rewardResult.player);

  return {
    classBonusLabels: rewardResult.classBonusLabels,
    coinsGained: rewardResult.coinsGained,
    player: rewardResult.player,
    quest: completedQuest,
    previousLevel: player.level,
    newLevel: rewardResult.player.level,
    leveledUp: rewardResult.player.level > player.level,
    xpGained: rewardResult.xpGained,
  };
}
