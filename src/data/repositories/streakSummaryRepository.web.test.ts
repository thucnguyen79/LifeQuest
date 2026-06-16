import { beforeEach, describe, expect, it, vi } from 'vitest';

import { streakSummaryRepository } from './streakSummaryRepository.web';

function createStorage() {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

describe('streakSummaryRepository.web', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorage());
  });

  it('persists and reads streak summary progress', () => {
    streakSummaryRepository.upsert({
      currentStreak: 3,
      longestStreak: 5,
    });

    expect(streakSummaryRepository.get()).toEqual({
      currentStreak: 3,
      longestStreak: 5,
    });
  });

  it('resets streak summary progress', () => {
    streakSummaryRepository.upsert({
      currentStreak: 3,
      longestStreak: 5,
    });

    streakSummaryRepository.reset();

    expect(streakSummaryRepository.get()).toEqual({
      currentStreak: 0,
      longestStreak: 0,
    });
  });
});
