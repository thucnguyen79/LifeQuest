import { calculateLevel, statByHabitCategory } from '@/core/constants/gameRules';
import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';
import { habitRepository } from '@/data/repositories/habitRepository';
import { playerRepository } from '@/data/repositories/playerRepository';
import { questRepository } from '@/data/repositories/questRepository';

type CompleteQuestResult = {
  player: Player;
  quest: Quest;
};

function applyQuestRewards(player: Player, quest: Quest): Player {
  const habit = habitRepository.getById(quest.habitId);
  const totalXp = player.totalXp + quest.xpReward;
  const statKey = habit ? statByHabitCategory[habit.category] : null;

  return {
    ...player,
    level: calculateLevel(totalXp),
    currentXp: totalXp % 100,
    totalXp,
    coins: player.coins + quest.coinReward,
    discipline: player.discipline + 1,
    ...(statKey ? { [statKey]: player[statKey] + 1 } : {}),
    updatedAt: new Date().toISOString(),
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
  const updatedPlayer = applyQuestRewards(player, quest);

  questRepository.updateStatus(quest.id, 'completed', completedAt);
  playerRepository.upsert(updatedPlayer);

  return {
    player: updatedPlayer,
    quest: completedQuest,
  };
}
