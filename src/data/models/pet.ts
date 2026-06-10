export type PetMood = 'happy' | 'neutral' | 'sad';

export type PetGrowthStage = 'egg' | 'baby' | 'young' | 'adult';

export type PetType = 'dragon' | 'fox' | 'cat' | 'owl';

export type Pet = {
  id: string;
  name: string;
  type: PetType;
  level: number;
  xp: number;
  mood: PetMood;
  growthStage: PetGrowthStage;
};
