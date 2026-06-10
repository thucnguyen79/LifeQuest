import { getDatabase, initializeLocalDatabase } from '@/data/local/database';
import type { Pet, PetGrowthStage, PetMood, PetType } from '@/data/models/pet';

type PetRow = {
  id: string;
  name: string;
  type: PetType;
  level: number;
  xp: number;
  mood: PetMood;
  growth_stage: PetGrowthStage;
};

function toPet(row: PetRow): Pet {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    level: row.level,
    xp: row.xp,
    mood: row.mood,
    growthStage: row.growth_stage,
  };
}

export const petRepository = {
  getById(id: string) {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<PetRow>('SELECT * FROM pets WHERE id = ?', id);
    return row ? toPet(row) : null;
  },

  getActive() {
    initializeLocalDatabase();

    const row = getDatabase().getFirstSync<PetRow>('SELECT * FROM pets ORDER BY level DESC LIMIT 1');
    return row ? toPet(row) : null;
  },

  upsert(pet: Pet) {
    initializeLocalDatabase();

    getDatabase().runSync(
      `
      INSERT OR REPLACE INTO pets (
        id,
        name,
        type,
        level,
        xp,
        mood,
        growth_stage
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      pet.id,
      pet.name,
      pet.type,
      pet.level,
      pet.xp,
      pet.mood,
      pet.growthStage,
    );
  },

  remove(id: string) {
    initializeLocalDatabase();
    getDatabase().runSync('DELETE FROM pets WHERE id = ?', id);
  },
};
