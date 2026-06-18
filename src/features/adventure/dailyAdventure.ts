import {
  defaultAdventureNodeTarget,
  defaultZoneByClass,
} from '@/core/constants/adventureZones';
import type { AdventureZoneId, DailyAdventure } from '@/data/models/adventure';
import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';

type AdventureProgress = Pick<DailyAdventure, 'cleared' | 'nodeProgress' | 'nodeTarget'>;

export function getDefaultAdventureZone(player?: Player | null): AdventureZoneId {
  return player ? defaultZoneByClass[player.selectedClass] : 'explorerTrail';
}

export function createDailyAdventure(
  date: string,
  zoneId: AdventureZoneId,
  quests: Quest[] = [],
): DailyAdventure {
  const progress = calculateAdventureProgress(quests);

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
): AdventureProgress {
  const rawProgress = quests.reduce((total, quest) => {
    const targetCount = Math.max(quest.targetCount ?? 1, 1);
    const progressCount =
      quest.status === 'completed' ? targetCount : Math.min(quest.progressCount ?? 0, targetCount);

    return total + progressCount;
  }, 0);
  const nodeProgress = Math.min(rawProgress, nodeTarget);

  return {
    cleared: nodeTarget > 0 && rawProgress >= nodeTarget,
    nodeProgress,
    nodeTarget,
  };
}

export function syncDailyAdventureProgress(
  adventure: DailyAdventure,
  quests: Quest[],
): DailyAdventure {
  return {
    ...adventure,
    ...calculateAdventureProgress(quests, adventure.nodeTarget),
    updatedAt: new Date().toISOString(),
  };
}
