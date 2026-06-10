import { characterClasses } from '@/core/constants/gameRules';
import type { Player, PlayerClass, StatKey } from '@/data/models/player';

const baseStats: Record<StatKey, number> = {
  strength: 1,
  intelligence: 1,
  focus: 1,
  wisdom: 1,
  charisma: 1,
  discipline: 1,
};

function createId() {
  return `player-${Date.now()}`;
}

export function createInitialPlayer(name: string, selectedClass: PlayerClass): Player {
  const now = new Date().toISOString();
  const classMeta = characterClasses[selectedClass];
  const stats = {
    ...baseStats,
    [classMeta.primaryStat]: baseStats[classMeta.primaryStat] + 2,
  };

  return {
    id: createId(),
    name: name.trim(),
    selectedClass,
    level: 1,
    currentXp: 0,
    totalXp: 0,
    coins: 0,
    strength: stats.strength,
    intelligence: stats.intelligence,
    focus: stats.focus,
    wisdom: stats.wisdom,
    charisma: stats.charisma,
    discipline: stats.discipline,
    createdAt: now,
    updatedAt: now,
  };
}
