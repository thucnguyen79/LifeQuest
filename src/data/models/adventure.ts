export type AdventureZoneId =
  | 'calmTemple'
  | 'explorerTrail'
  | 'forestOfFocus'
  | 'scholarLibrary'
  | 'strengthArena';

export type DailyAdventure = {
  date: string;
  zoneId: AdventureZoneId;
  nodeProgress: number;
  nodeTarget: number;
  cleared: boolean;
  updatedAt: string;
};
