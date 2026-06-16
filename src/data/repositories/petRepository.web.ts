import type { Pet } from '@/data/models/pet';

const storageKey = 'lifequest.pet';
let memoryPet: Pet | null = null;

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function readPet() {
  const storage = getStorage();

  if (!storage) {
    return memoryPet;
  }

  const value = storage.getItem(storageKey);
  return value ? (JSON.parse(value) as Pet) : null;
}

export const petRepository = {
  getById(id: string) {
    const pet = readPet();
    return pet?.id === id ? pet : null;
  },

  getActive() {
    return readPet();
  },

  upsert(pet: Pet) {
    memoryPet = pet;
    getStorage()?.setItem(storageKey, JSON.stringify(pet));
  },

  remove(id: string) {
    const pet = readPet();

    if (pet?.id !== id) {
      return;
    }

    memoryPet = null;
    getStorage()?.removeItem(storageKey);
  },
};
