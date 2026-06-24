import type { GameIconName } from '@/core/components/GameIcon';
import { calculatePetGrowthStage, calculatePetLevel } from '@/core/constants/gameRules';
import type { Pet } from '@/data/models/pet';

export type ShopItemId = 'petFood' | 'questReroll' | 'streakFreeze';

export type ShopInventory = Record<ShopItemId, number>;

export type ShopItem = {
  actionLabel: string;
  body: string;
  cost: number;
  effectLabel: string;
  icon: GameIconName;
  id: ShopItemId;
  name: string;
  usable: boolean;
};

export const defaultShopInventory: ShopInventory = {
  petFood: 0,
  questReroll: 0,
  streakFreeze: 0,
};

export const petFoodBondXp = 20;

export const rewardShopItems: ShopItem[] = [
  {
    actionLabel: 'Feed',
    body: 'A small treat for Mochi. Use it to grow bond XP outside quest completion.',
    cost: 12,
    effectLabel: `Use: +${petFoodBondXp} pet bond XP`,
    icon: 'petDragon',
    id: 'petFood',
    name: 'Pet Food',
    usable: true,
  },
  {
    actionLabel: 'Auto-use',
    body: 'Automatically protects your streak when you miss exactly one day.',
    cost: 25,
    effectLabel: 'Auto-use: preserve one streak across a one-day gap',
    icon: 'flame',
    id: 'streakFreeze',
    name: 'Streak Freeze',
    usable: false,
  },
  {
    actionLabel: 'Dashboard',
    body: 'Makes one pending quest lighter without removing completed progress.',
    cost: 18,
    effectLabel: 'Use on Dashboard: lower target, energy, and estimated time once',
    icon: 'scroll',
    id: 'questReroll',
    name: 'Quest Reroll',
    usable: false,
  },
];

export function getShopItem(itemId: ShopItemId) {
  return rewardShopItems.find((item) => item.id === itemId);
}

export function normalizeShopInventory(inventory?: Partial<ShopInventory>): ShopInventory {
  return {
    ...defaultShopInventory,
    ...inventory,
  };
}

export function addShopItem(inventory: ShopInventory, itemId: ShopItemId): ShopInventory {
  return {
    ...inventory,
    [itemId]: inventory[itemId] + 1,
  };
}

export function removeShopItem(inventory: ShopInventory, itemId: ShopItemId): ShopInventory {
  return {
    ...inventory,
    [itemId]: Math.max(inventory[itemId] - 1, 0),
  };
}

export function feedPetWithFood(pet: Pet): Pet {
  const nextPetXp = pet.xp + petFoodBondXp;

  return {
    ...pet,
    growthStage: calculatePetGrowthStage(nextPetXp),
    level: calculatePetLevel(nextPetXp),
    mood: 'happy',
    xp: nextPetXp,
  };
}
