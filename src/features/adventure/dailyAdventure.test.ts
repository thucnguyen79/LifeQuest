import { describe, expect, it } from 'vitest';

import {
  calculateAdventureProgress,
  calculateAdventureQuestSummary,
  getDefaultAdventureZone,
} from '@/features/adventure/dailyAdventure';
import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';

const baseQuest: Quest = {
  id: 'quest-1',
  habitId: 'habit-1',
  category: 'learning',
  title: 'Read',
  date: '2026-06-18',
  xpReward: 10,
  coinReward: 5,
  targetCount: 3,
  progressCount: 0,
  priority: 'normal',
  energy: 'medium',
  status: 'pending',
};

function createPlayer(selectedClass: Player['selectedClass']): Player {
  return {
    id: 'player-1',
    name: 'Thuc',
    selectedClass,
    level: 1,
    currentXp: 0,
    totalXp: 0,
    coins: 0,
    strength: 1,
    intelligence: 1,
    focus: 1,
    wisdom: 1,
    charisma: 1,
    discipline: 1,
    createdAt: '2026-06-18T00:00:00.000Z',
    updatedAt: '2026-06-18T00:00:00.000Z',
  };
}

describe('daily adventure', () => {
  it('defaults the daily zone from selected class', () => {
    expect(getDefaultAdventureZone(createPlayer('warrior'))).toBe('strengthArena');
    expect(getDefaultAdventureZone(createPlayer('scholar'))).toBe('scholarLibrary');
    expect(getDefaultAdventureZone(createPlayer('monk'))).toBe('calmTemple');
    expect(getDefaultAdventureZone(createPlayer('creator'))).toBe('forestOfFocus');
    expect(getDefaultAdventureZone(createPlayer('explorer'))).toBe('explorerTrail');
  });

  it('turns quest progress into capped node progress', () => {
    const progress = calculateAdventureProgress([
      { ...baseQuest, progressCount: 2 },
      { ...baseQuest, id: 'quest-2', status: 'completed', targetCount: 3, progressCount: 3 },
    ]);

    expect(progress.nodeProgress).toBe(4);
    expect(progress.nodeTarget).toBe(4);
    expect(progress.cleared).toBe(true);
  });

  it('adds a route bonus when a completed quest matches the active zone', () => {
    const summary = calculateAdventureQuestSummary(
      [
        { ...baseQuest, status: 'completed', targetCount: 1, progressCount: 1 },
        { ...baseQuest, id: 'quest-2', category: 'fitness', status: 'completed', targetCount: 1, progressCount: 1 },
      ],
      4,
      'scholarLibrary',
    );

    expect(summary.baseProgress).toBe(2);
    expect(summary.bonusProgress).toBe(1);
    expect(summary.routeBonusProgress).toBe(1);
    expect(summary.objectiveBonusProgress).toBe(0);
    expect(summary.nodeProgress).toBe(3);
    expect(summary.matchedQuestCount).toBe(1);
  });

  it('adds one map progress for each completed bonus objective', () => {
    const summary = calculateAdventureQuestSummary(
      [{ ...baseQuest, bonusCompleted: true, bonusObjective: 'No phone', progressCount: 1 }],
      4,
      'forestOfFocus',
    );

    expect(summary.baseProgress).toBe(1);
    expect(summary.objectiveBonusProgress).toBe(1);
    expect(summary.bonusProgress).toBe(1);
    expect(summary.nodeProgress).toBe(2);
  });
});
