import type { DailyChestRecord } from './dailyChestRepository';

const storageKey = 'lifequest.dailyChest';
const defaultRecord: DailyChestRecord = {};
let memoryRecord: DailyChestRecord = defaultRecord;

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function readRecord() {
  const storage = getStorage();

  if (!storage) {
    return memoryRecord;
  }

  const value = storage.getItem(storageKey);
  return value ? (JSON.parse(value) as DailyChestRecord) : defaultRecord;
}

export const dailyChestRepository = {
  get() {
    return readRecord();
  },

  claim(dateKey: string) {
    const record: DailyChestRecord = {
      claimedDate: dateKey,
    };

    memoryRecord = record;
    getStorage()?.setItem(storageKey, JSON.stringify(record));

    return record;
  },

  reset() {
    memoryRecord = defaultRecord;
    getStorage()?.removeItem(storageKey);
  },
};
