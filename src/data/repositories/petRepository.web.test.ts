import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Pet } from '@/data/models/pet';

import { petRepository } from './petRepository.web';

function createStorage() {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

const pet: Pet = {
  growthStage: 'baby',
  id: 'pet-starter',
  level: 2,
  mood: 'happy',
  name: 'Mochi',
  type: 'dragon',
  xp: 105,
};

describe('petRepository.web', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorage());
  });

  it('persists and reads the active pet', () => {
    petRepository.upsert(pet);

    expect(petRepository.getActive()).toEqual(pet);
    expect(petRepository.getById('pet-starter')).toEqual(pet);
    expect(petRepository.getById('unknown')).toBeNull();
  });

  it('removes the persisted pet by id', () => {
    petRepository.upsert(pet);
    petRepository.remove('pet-starter');

    expect(petRepository.getActive()).toBeNull();
  });
});
