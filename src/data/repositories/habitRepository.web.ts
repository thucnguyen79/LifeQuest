import type { Habit } from '@/data/models/habit';

const storageKey = 'lifequest.habits';
let memoryHabits: Habit[] = [];

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function readHabits() {
  const storage = getStorage();

  if (!storage) {
    return memoryHabits;
  }

  const value = storage.getItem(storageKey);
  return value ? (JSON.parse(value) as Habit[]) : [];
}

function writeHabits(habits: Habit[]) {
  memoryHabits = habits;
  getStorage()?.setItem(storageKey, JSON.stringify(habits));
}

export const habitRepository = {
  list() {
    return readHabits().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  listActive() {
    return this.list().filter((habit) => habit.isActive);
  },

  getById(id: string) {
    return readHabits().find((habit) => habit.id === id) ?? null;
  },

  upsert(habit: Habit) {
    const habits = readHabits();
    const nextHabits = habits.some((item) => item.id === habit.id)
      ? habits.map((item) => (item.id === habit.id ? habit : item))
      : [...habits, habit];

    writeHabits(nextHabits);
  },

  deactivate(id: string, updatedAt = new Date().toISOString()) {
    writeHabits(
      readHabits().map((habit) =>
        habit.id === id ? { ...habit, isActive: false, updatedAt } : habit,
      ),
    );
  },

  remove(id: string) {
    writeHabits(readHabits().filter((habit) => habit.id !== id));
  },
};
