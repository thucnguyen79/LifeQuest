export type PlayerClass = 'warrior' | 'scholar' | 'monk' | 'creator' | 'explorer';

export type PlayerStats = {
  strength: number;
  intelligence: number;
  focus: number;
  wisdom: number;
  charisma: number;
  discipline: number;
};

export type Player = {
  id: string;
  name: string;
  className: string;
  classKey: PlayerClass;
  classIcon: string;
  level: number;
  currentXp: number;
  totalXp: number;
  coins: number;
  stats: PlayerStats;
};
