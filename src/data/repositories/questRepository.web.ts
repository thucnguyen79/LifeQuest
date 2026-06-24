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
  const quests = value ? (JSON.parse(value) as Quest[]) : [];
  return quests.map((quest) => ({
    ...quest,
    bonusCompleted: quest.bonusCompleted ?? false,
    category: quest.category ?? 'deepWork',
    energy: quest.energy ?? 'medium',
    priority: quest.priority ?? 'normal',
    progressCount: quest.progressCount ?? (quest.status === 'completed' ? quest.targetCount ?? 1 : 0),
    rerolledAt: quest.rerolledAt ?? undefined,
    targetCount: quest.targetCount ?? 1,
  }));
}

function writeQuests(quests: Quest[]) {
  memoryQuests = quests;
  getStorage()?.setItem(storageKey, JSON.stringify(quests));
}

export const questRepository = {
  listAll() {
    return [...readQuests()].sort(
      (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
    );
  },

  markPendingBeforeDateAsMissed(date: string) {
    writeQuests(
      readQuests().map((quest) =>
        quest.date < date && quest.status === 'pending'
          ? { ...quest, completedAt: undefined, status: 'missed' }
          : quest,
      ),
    );
  },

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

  updateProgress(id: string, progressCount: number) {
    writeQuests(
      readQuests().map((quest) => (quest.id === id ? { ...quest, progressCount } : quest)),
    );
  },

  updateBonusCompleted(id: string, bonusCompleted: boolean) {
    writeQuests(
      readQuests().map((quest) =>
        quest.id === id ? { ...quest, bonusCompleted } : quest,
      ),
    );
  },

  removeForDate(date: string) {
    writeQuests(readQuests().filter((quest) => quest.date !== date));
  },

  remove(id: string) {
    writeQuests(readQuests().filter((quest) => quest.id !== id));
  },
};
