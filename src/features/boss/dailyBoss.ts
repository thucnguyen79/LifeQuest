import { getAdventureZone } from '@/core/constants/adventureZones';
import type { DailyAdventure } from '@/data/models/adventure';
import type { Quest } from '@/data/models/quest';

export type DailyBossStatus = 'active' | 'defeated' | 'locked';

export type DailyBossState = {
  bonusDamage: number;
  currentHp: number;
  damage: number;
  date: string;
  maxHp: number;
  name: string;
  status: DailyBossStatus;
  unlocksRareChest: boolean;
  zoneName: string;
};

const damagePerProgress = 6;
const completionDamageBonus = 4;
export const bonusObjectiveBossDamage = 2;
function getBossName(adventure: DailyAdventure) {
  const zone = getAdventureZone(adventure.zoneId);

  return `${zone.shortName} Warden`;
}

function calculateBossMaxHp(quests: Quest[]) {
  const targetLoad = quests.reduce((total, quest) => total + Math.max(quest.targetCount ?? 1, 1), 0);

  return quests.length === 0 ? 0 : targetLoad * damagePerProgress + quests.length * completionDamageBonus;
}

function calculateBossDamage(quests: Quest[]) {
  const baseDamage = quests.reduce((total, quest) => {
    const targetCount = Math.max(quest.targetCount ?? 1, 1);
    const progressCount =
      quest.status === 'completed' ? targetCount : Math.min(quest.progressCount ?? 0, targetCount);
    const progressDamage = progressCount * damagePerProgress;
    const completionBonus = quest.status === 'completed' ? completionDamageBonus : 0;

    return total + progressDamage + completionBonus;
  }, 0);

  return baseDamage + quests.filter((quest) => quest.bonusCompleted).length * bonusObjectiveBossDamage;
}

export function getDailyBossState(
  date: string,
  quests: Quest[],
  adventure: DailyAdventure,
): DailyBossState {
  const maxHp = calculateBossMaxHp(quests);
  const rawDamage = calculateBossDamage(quests);
  const bonusDamage = quests.filter((quest) => quest.bonusCompleted).length * bonusObjectiveBossDamage;
  const unlocked = adventure.cleared && quests.length > 0;
  const damage = unlocked ? Math.min(rawDamage, maxHp) : 0;
  const defeated = unlocked && maxHp > 0 && damage >= maxHp;
  const zone = getAdventureZone(adventure.zoneId);

  return {
    bonusDamage,
    currentHp: Math.max(maxHp - damage, 0),
    damage,
    date,
    maxHp,
    name: getBossName(adventure),
    status: !unlocked ? 'locked' : defeated ? 'defeated' : 'active',
    unlocksRareChest: defeated,
    zoneName: zone.name,
  };
}
