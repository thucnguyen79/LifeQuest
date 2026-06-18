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
    actionLabel: 'Stored',
    body: 'Protects a future streak when life gets chaotic. Gameplay hook comes next.',
    cost: 25,
    effectLabel: 'Passive item for a future streak shield action',
    icon: 'flame',
    id: 'streakFreeze',
    name: 'Streak Freeze',
    usable: false,
  },
  {
    actionLabel: 'Stored',
    body: 'Rerolls one future quest into a better fit for the day.',
    cost: 18,
    effectLabel: 'Future action: reroll one pending quest',
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
