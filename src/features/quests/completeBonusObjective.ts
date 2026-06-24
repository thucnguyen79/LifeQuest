import { calculateLevel } from '@/core/constants/gameRules';
import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';
import { playerRepository } from '@/data/repositories/playerRepository';
import { questRepository } from '@/data/repositories/questRepository';

export const bonusObjectiveXpReward = 5;
export const bonusObjectiveCoinReward = 2;

export type CompleteBonusObjectiveResult = {
  coinsGained: number;
  leveledUp: boolean;
  newLevel: number;
  player: Player;
  previousLevel: number;
  quest: Quest;
  xpGained: number;
};

export function completeBonusObjective(
  player: Player,
  questId: string,
): CompleteBonusObjectiveResult | null {
  const quest = questRepository.getById(questId);

  if (
    !quest ||
    quest.status === 'missed' ||
    quest.bonusCompleted ||
    !quest.bonusObjective?.trim()
  ) {
    return null;
  }

  const totalXp = player.totalXp + bonusObjectiveXpReward;
  const nextPlayer: Player = {
    ...player,
    coins: player.coins + bonusObjectiveCoinReward,
    currentXp: totalXp % 100,
    level: calculateLevel(totalXp),
    totalXp,
    updatedAt: new Date().toISOString(),
  };
  const nextQuest: Quest = {
    ...quest,
    bonusCompleted: true,
  };

  questRepository.updateBonusCompleted(quest.id, true);
  playerRepository.upsert(nextPlayer);

  return {
    coinsGained: bonusObjectiveCoinReward,
    leveledUp: nextPlayer.level > player.level,
    newLevel: nextPlayer.level,
    player: nextPlayer,
    previousLevel: player.level,
    quest: nextQuest,
    xpGained: bonusObjectiveXpReward,
  };
}
