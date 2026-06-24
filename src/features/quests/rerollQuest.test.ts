import { describe, expect, it } from 'vitest';

import type { Quest } from '@/data/models/quest';

import { rerollPendingQuest } from './rerollQuest';

function createQuest(overrides: Partial<Quest> = {}): Quest {
  return {
    category: 'deepWork',
    coinReward: 6,
    date: '2026-06-24',
    energy: 'heavy',
    estimatedMinutes: 40,
    habitId: 'habit-1',
    id: 'quest-1',
    priority: 'normal',
    progressCount: 1,
    status: 'pending',
    targetCount: 3,
    title: 'Deep work',
    xpReward: 20,
    ...overrides,
  };
}

describe('rerollPendingQuest', () => {
  it('makes one pending quest lighter without losing progress', () => {
    const result = rerollPendingQuest(createQuest(), '2026-06-24T08:00:00.000Z');

    expect(result.rerolled).toBe(true);
    expect(result.quest).toMatchObject({
      energy: 'medium',
      estimatedMinutes: 30,
      progressCount: 1,
      rerolledAt: '2026-06-24T08:00:00.000Z',
      targetCount: 2,
    });
  });

  it('does not reroll completed or already rerolled quests', () => {
    expect(rerollPendingQuest(createQuest({ status: 'completed' })).rerolled).toBe(false);
    expect(
      rerollPendingQuest(createQuest({ rerolledAt: '2026-06-24T08:00:00.000Z' })).rerolled,
    ).toBe(false);
  });
});
