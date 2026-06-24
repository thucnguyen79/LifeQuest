import {
  defaultAdventureNodeTarget,
  defaultZoneByClass,
  getAdventureZone,
} from '@/core/constants/adventureZones';
import type { AdventureZoneId, DailyAdventure } from '@/data/models/adventure';
import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';

type AdventureProgress = Pick<DailyAdventure, 'cleared' | 'nodeProgress' | 'nodeTarget'>;

export type AdventureQuestSummary = AdventureProgress & {
  baseProgress: number;
  bonusProgress: number;
  matchedQuestCount: number;
  nextNodeIndex: number;
  objectiveBonusProgress: number;
  rawProgress: number;
  routeBonusProgress: number;
};

export const bonusObjectiveMapProgress = 1;

export function getDefaultAdventureZone(player?: Player | null): AdventureZoneId {
  return player ? defaultZoneByClass[player.selectedClass] : 'explorerTrail';
}

export function createDailyAdventure(
  date: string,
  zoneId: AdventureZoneId,
  quests: Quest[] = [],
): DailyAdventure {
  const progress = calculateAdventureProgress(quests, defaultAdventureNodeTarget, zoneId);

  return {
    date,
    zoneId,
    ...progress,
    updatedAt: new Date().toISOString(),
  };
}

export function calculateAdventureProgress(
  quests: Quest[],
  nodeTarget = defaultAdventureNodeTarget,
  zoneId?: AdventureZoneId,
): AdventureProgress {
  const summary = calculateAdventureQuestSummary(quests, nodeTarget, zoneId);

  return {
    cleared: summary.cleared,
    nodeProgress: summary.nodeProgress,
    nodeTarget: summary.nodeTarget,
  };
}

export function calculateAdventureQuestSummary(
  quests: Quest[],
  nodeTarget = defaultAdventureNodeTarget,
  zoneId?: AdventureZoneId,
): AdventureQuestSummary {
  const zone = zoneId ? getAdventureZone(zoneId) : null;
  const baseProgress = quests.reduce((total, quest) => {
    const targetCount = Math.max(quest.targetCount ?? 1, 1);
    const progressCount =
      quest.status === 'completed' ? targetCount : Math.min(quest.progressCount ?? 0, targetCount);

    return total + progressCount;
  }, 0);
  const matchedQuestCount = zone
    ? quests.filter((quest) => zone.focusCategories.includes(quest.category)).length
    : 0;
  const routeBonusProgress = zone
    ? quests.filter(
        (quest) => quest.status === 'completed' && zone.focusCategories.includes(quest.category),
      ).length
    : 0;
  const objectiveBonusProgress =
    quests.filter((quest) => quest.bonusCompleted).length * bonusObjectiveMapProgress;
  const bonusProgress = routeBonusProgress + objectiveBonusProgress;
  const rawProgress = baseProgress + bonusProgress;
  const nodeProgress = Math.min(rawProgress, nodeTarget);

  return {
    cleared: nodeTarget > 0 && rawProgress >= nodeTarget,
    baseProgress,
    bonusProgress,
    matchedQuestCount,
    nextNodeIndex: Math.min(nodeProgress + 1, nodeTarget),
    nodeProgress,
    nodeTarget,
    objectiveBonusProgress,
    rawProgress,
    routeBonusProgress,
  };
}

export function syncDailyAdventureProgress(
  adventure: DailyAdventure,
  quests: Quest[],
): DailyAdventure {
  return {
    ...adventure,
    ...calculateAdventureProgress(quests, adventure.nodeTarget, adventure.zoneId),
    updatedAt: new Date().toISOString(),
  };
}
