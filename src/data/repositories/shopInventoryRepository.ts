import { getDatabase, initializeLocalDatabase } from '@/data/local/database';
import type { ShopInventory } from '@/features/shop/shopItems';
import { defaultShopInventory, normalizeShopInventory } from '@/features/shop/shopItems';

const metadataKey = 'shop_inventory';

export const shopInventoryRepository = {
  get() {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<{ value: string }>(
      'SELECT value FROM app_metadata WHERE key = ?',
      metadataKey,
    );

    return row ? normalizeShopInventory(JSON.parse(row.value) as Partial<ShopInventory>) : defaultShopInventory;
  },

  upsert(inventory: ShopInventory) {
    initializeLocalDatabase();

    getDatabase().runSync(
      'INSERT OR REPLACE INTO app_metadata (key, value) VALUES (?, ?)',
      metadataKey,
      JSON.stringify(inventory),
    );
  },

  reset() {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM app_metadata WHERE key = ?', metadataKey);
  },
};
