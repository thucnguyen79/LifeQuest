import { describe, expect, it } from 'vitest';

import type { Pet } from '@/data/models/pet';

import { getPetCareState } from './petCare';

const basePet: Pet = {
  growthStage: 'baby',
  id: 'pet-1',
  level: 1,
  mood: 'neutral',
  name: 'Mochi',
  type: 'dragon',
  xp: 0,
};

describe('getPetCareState', () => {
  it('prioritizes happy mood', () => {
    expect(getPetCareState({ ...basePet, mood: 'happy' }, 0, 3).label).toBe('Happy');
  });

  it('shows hungry when food is available', () => {
    expect(getPetCareState(basePet, 1, 3).label).toBe('Hungry');
  });

  it('shows sleepy when quests are pending and no food is available', () => {
    expect(getPetCareState(basePet, 0, 2).label).toBe('Sleepy');
  });

  it('shows resting when no action is queued', () => {
    expect(getPetCareState(basePet, 0, 0).label).toBe('Resting');
  });
});
