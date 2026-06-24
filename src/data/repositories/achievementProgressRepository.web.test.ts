import { beforeEach, describe, expect, it, vi } from 'vitest';

import { achievementProgressRepository } from './achievementProgressRepository.web';

function createStorage() {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe('achievementProgressRepository.web', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorage());
    achievementProgressRepository.reset();
  });

  it('persists lifetime coins and unlock timestamps', () => {
    achievementProgressRepository.upsert({
      lifetimeCoinsEarned: 120,
      unlockedAtById: { coins100: '2026-06-24T08:00:00.000Z' },
    });

    expect(achievementProgressRepository.get()).toEqual({
      lifetimeCoinsEarned: 120,
      unlockedAtById: { coins100: '2026-06-24T08:00:00.000Z' },
    });
  });
});
