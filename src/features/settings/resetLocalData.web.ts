const storageKeys = [
  'lifequest.player',
  'lifequest.habits',
  'lifequest.quests',
  'lifequest.pet',
  'lifequest.streakSummary',
];

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function resetLocalData() {
  const storage = getStorage();

  for (const key of storageKeys) {
    storage?.removeItem(key);
  }
}
