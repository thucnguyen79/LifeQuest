import { calculateLevel, statByHabitCategory } from '@/core/constants/gameRules';
import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';
import { habitRepository } from '@/data/repositories/habitRepository';
import { playerRepository } from '@/data/repositories/playerRepository';
import { questRepository } from '@/data/repositories/questRepository';
import { getClassRewardModifiers } from '@/features/classes/classSkills';

type CompleteQuestResult = {
  classBonusLabels: string[];
  completed: boolean;
  coinsGained: number;
  player: Player;
  quest: Quest;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  xpGained: number;
};

type QuestProgressResult = {
  completed: false;
  coinsGained: 0;
  player: Player;
  quest: Quest;
  xpGained: 0;
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

export function completeQuest(
  player: Player,
  questId: string,
): CompleteQuestResult | QuestProgressResult | null {
  const quest = questRepository.getById(questId);

  if (!quest || quest.status !== 'pending') {
    return null;
  }

  const targetCount = Math.max(quest.targetCount ?? 1, 1);
  const nextProgressCount = Math.min((quest.progressCount ?? 0) + 1, targetCount);

  if (nextProgressCount < targetCount) {
    const updatedQuest: Quest = {
      ...quest,
      progressCount: nextProgressCount,
      targetCount,
    };

    questRepository.updateProgress(quest.id, nextProgressCount);

    return {
      completed: false,
      coinsGained: 0,
      player,
      quest: updatedQuest,
      xpGained: 0,
    };
  }

  const completedAt = new Date().toISOString();
  const completedQuest: Quest = {
    ...quest,
    progressCount: targetCount,
    targetCount,
    status: 'completed',
    completedAt,
  };
  const rewardResult = applyQuestRewards(player, quest);

  questRepository.updateStatus(quest.id, 'completed', completedAt);
  questRepository.updateProgress(quest.id, targetCount);
  playerRepository.upsert(rewardResult.player);

  return {
    classBonusLabels: rewardResult.classBonusLabels,
    completed: true,
    coinsGained: rewardResult.coinsGained,
    player: rewardResult.player,
    quest: completedQuest,
    previousLevel: player.level,
    newLevel: rewardResult.player.level,
    leveledUp: rewardResult.player.level > player.level,
    xpGained: rewardResult.xpGained,
  };
}
