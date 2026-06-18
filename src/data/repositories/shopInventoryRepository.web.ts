import type { ShopInventory } from '@/features/shop/shopItems';
import { defaultShopInventory, normalizeShopInventory } from '@/features/shop/shopItems';

const storageKey = 'lifequest.shopInventory';
let memoryInventory: ShopInventory = defaultShopInventory;

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function readInventory() {
  const storage = getStorage();

  if (!storage) {
    return memoryInventory;
  }

  const value = storage.getItem(storageKey);
  return value ? normalizeShopInventory(JSON.parse(value) as Partial<ShopInventory>) : defaultShopInventory;
}

export const shopInventoryRepository = {
  get() {
    return readInventory();
  },

  upsert(inventory: ShopInventory) {
    memoryInventory = inventory;
    getStorage()?.setItem(storageKey, JSON.stringify(inventory));
  },

  reset() {
    memoryInventory = defaultShopInventory;
    getStorage()?.removeItem(storageKey);
  },
};
