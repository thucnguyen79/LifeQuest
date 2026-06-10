import type { Quest, QuestStatus } from '@/data/models/quest';

const storageKey = 'lifequest.quests';
let memoryQuests: Quest[] = [];

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function readQuests() {
  const storage = getStorage();

  if (!storage) {
    return memoryQuests;
  }

  const value = storage.getItem(storageKey);
  return value ? (JSON.parse(value) as Quest[]) : [];
}

function writeQuests(quests: Quest[]) {
  memoryQuests = quests;
  getStorage()?.setItem(storageKey, JSON.stringify(quests));
}

export const questRepository = {
  listByDate(date: string) {
    return readQuests()
      .filter((quest) => quest.date === date)
      .sort((a, b) => a.title.localeCompare(b.title));
  },

  getById(id: string) {
    return readQuests().find((quest) => quest.id === id) ?? null;
  },

  upsert(quest: Quest) {
    const quests = readQuests();
    const nextQuests = quests.some((item) => item.id === quest.id)
      ? quests.map((item) => (item.id === quest.id ? quest : item))
      : [...quests, quest];

    writeQuests(nextQuests);
  },

  updateStatus(id: string, status: QuestStatus, completedAt?: string) {
    writeQuests(
      readQuests().map((quest) =>
        quest.id === id ? { ...quest, status, completedAt } : quest,
      ),
    );
  },

  removeForDate(date: string) {
    writeQuests(readQuests().filter((quest) => quest.date !== date));
  },
};
