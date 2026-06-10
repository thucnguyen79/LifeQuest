export type PlayerClass = 'warrior' | 'scholar' | 'monk' | 'creator' | 'explorer';

export type StatKey =
  | 'strength'
  | 'intelligence'
  | 'focus'
  | 'wisdom'
  | 'charisma'
  | 'discipline';

export type Player = {
  id: string;
  name: string;
  selectedClass: PlayerClass;
  level: number;
  currentXp: number;
  totalXp: number;
  coins: number;
  strength: number;
  intelligence: number;
  focus: number;
  wisdom: number;
  charisma: number;
  discipline: number;
  createdAt: string;
  updatedAt: string;
};
