import { describe, expect, it } from 'vitest';

import {
  addShopItem,
  defaultShopInventory,
  feedPetWithFood,
  normalizeShopInventory,
  removeShopItem,
} from './shopItems';

describe('shop inventory helpers', () => {
  it('normalizes missing inventory keys', () => {
    expect(normalizeShopInventory({ petFood: 2 })).toEqual({
      petFood: 2,
      questReroll: 0,
      streakFreeze: 0,
    });
  });

  it('adds and removes shop items without going below zero', () => {
    const inventory = addShopItem(defaultShopInventory, 'petFood');

    expect(inventory.petFood).toBe(1);
    expect(removeShopItem(inventory, 'petFood').petFood).toBe(0);
    expect(removeShopItem(defaultShopInventory, 'petFood').petFood).toBe(0);
  });

  it('feeds the pet with bond XP and happy mood', () => {
    const pet = feedPetWithFood({
      growthStage: 'baby',
      id: 'pet-1',
      level: 1,
      mood: 'neutral',
      name: 'Mochi',
      type: 'dragon',
      xp: 0,
    });

    expect(pet.xp).toBe(20);
    expect(pet.mood).toBe('happy');
  });
});
