import { describe, expect, it } from 'vitest';

import {
  calculateLevel,
  calculatePetCurrentXp,
  calculatePetGrowthStage,
  calculatePetLevel,
} from './gameRules';

describe('gameRules', () => {
  it('calculates player level from total XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(250)).toBe(3);
  });

  it('calculates pet level and current level XP', () => {
    expect(calculatePetLevel(0)).toBe(1);
    expect(calculatePetLevel(79)).toBe(1);
    expect(calculatePetLevel(80)).toBe(2);
    expect(calculatePetCurrentXp(159)).toBe(79);
    expect(calculatePetCurrentXp(160)).toBe(0);
  });

  it('calculates pet growth stages from total bond XP', () => {
    expect(calculatePetGrowthStage(0)).toBe('baby');
    expect(calculatePetGrowthStage(159)).toBe('baby');
    expect(calculatePetGrowthStage(160)).toBe('young');
    expect(calculatePetGrowthStage(399)).toBe('young');
    expect(calculatePetGrowthStage(400)).toBe('adult');
  });
});
