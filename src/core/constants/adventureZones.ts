import type { GameIconName } from '@/core/components/GameIcon';
import type { AdventureZoneId } from '@/data/models/adventure';
import type { PlayerClass, StatKey } from '@/data/models/player';

export type AdventureZone = {
  id: AdventureZoneId;
  name: string;
  shortName: string;
  description: string;
  icon: GameIconName;
  tone: 'dark' | 'gold' | 'mint' | 'plain' | 'sky';
  primaryStat: StatKey;
  mapTheme: string;
};

export const defaultAdventureNodeTarget = 4;

export const adventureZones: Record<AdventureZoneId, AdventureZone> = {
  calmTemple: {
    id: 'calmTemple',
    name: 'Calm Temple',
    shortName: 'Temple',
    description: 'Quiet quests steady your mind and protect streak momentum.',
    icon: 'moon',
    tone: 'sky',
    primaryStat: 'wisdom',
    mapTheme: 'Wisdom route',
  },
  explorerTrail: {
    id: 'explorerTrail',
    name: 'Explorer Trail',
    shortName: 'Trail',
    description: 'A flexible path for mixed quests, discovery, and chest luck.',
    icon: 'compass',
    tone: 'mint',
    primaryStat: 'charisma',
    mapTheme: 'Discovery route',
  },
  forestOfFocus: {
    id: 'forestOfFocus',
    name: 'Forest of Focus',
    shortName: 'Forest',
    description: 'Deep work clears dense nodes and sharpens daily focus.',
    icon: 'focus',
    tone: 'mint',
    primaryStat: 'focus',
    mapTheme: 'Focus route',
  },
  scholarLibrary: {
    id: 'scholarLibrary',
    name: 'Scholar Library',
    shortName: 'Library',
    description: 'Learning quests turn pages into map progress and rewards.',
    icon: 'book',
    tone: 'sky',
    primaryStat: 'intelligence',
    mapTheme: 'Learning route',
  },
  strengthArena: {
    id: 'strengthArena',
    name: 'Strength Arena',
    shortName: 'Arena',
    description: 'Fitness and hard quests push through arena checkpoints.',
    icon: 'shield',
    tone: 'gold',
    primaryStat: 'strength',
    mapTheme: 'Strength route',
  },
};

export const adventureZoneList = [
  adventureZones.forestOfFocus,
  adventureZones.scholarLibrary,
  adventureZones.strengthArena,
  adventureZones.calmTemple,
  adventureZones.explorerTrail,
];

export const defaultZoneByClass: Record<PlayerClass, AdventureZoneId> = {
  creator: 'forestOfFocus',
  explorer: 'explorerTrail',
  monk: 'calmTemple',
  scholar: 'scholarLibrary',
  warrior: 'strengthArena',
};

export function getAdventureZone(zoneId: AdventureZoneId) {
  return adventureZones[zoneId];
}
