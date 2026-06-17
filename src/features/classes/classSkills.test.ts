import { describe, expect, it } from 'vitest';

import type { Habit } from '@/data/models/habit';
import type { Player } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';

import { classSkillInfo, getClassRewardModifiers } from './classSkills';

const now = '2026-06-16T00:00:00.000Z';

function createPlayer(selectedClass: Player['selectedClass']): Player {
  return {
    charisma: 1,
    coins: 0,
    createdAt: now,
    currentXp: 0,
    discipline: 1,
    focus: 1,
    id: 'player-1',
    intelligence: 1,
    level: 1,
    name: 'Thuc',
    selectedClass,
    strength: 1,
    totalXp: 0,
    updatedAt: now,
    wisdom: 1,
  };
}

function createHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    category: 'fitness',
    createdAt: now,
    difficulty: 'easy',
    energy: 'medium',
    frequencyType: 'daily',
    id: 'habit-1',
    isActive: true,
    priority: 'normal',
    selectedWeekdays: [],
    title: 'Train',
    updatedAt: now,
    ...overrides,
  };
}

function createQuest(overrides: Partial<Quest> = {}): Quest {
  return {
    coinReward: 6,
    date: '2026-06-16',
    energy: 'medium',
    habitId: 'habit-1',
    id: 'quest-1',
    priority: 'normal',
    progressCount: 0,
    status: 'pending',
    targetCount: 1,
    title: 'Train',
    xpReward: 20,
    ...overrides,
  };
}

describe('class skills', () => {
  it('defines skill copy for all five classes', () => {
    expect(Object.keys(classSkillInfo).sort()).toEqual([
      'creator',
      'explorer',
      'monk',
      'scholar',
      'warrior',
    ]);
  });

  it('does not apply quest bonuses without a source habit', () => {
    expect(getClassRewardModifiers(createPlayer('warrior'), createQuest(), null)).toEqual({
      bonusCoins: 0,
      bonusXp: 0,
      labels: [],
    });
  });

  it('stacks Warrior Fitness and Hard XP bonuses', () => {
    expect(
      getClassRewardModifiers(
        createPlayer('warrior'),
        createQuest({ xpReward: 35 }),
        createHabit({ category: 'fitness', difficulty: 'hard' }),
      ),
    ).toEqual({
      bonusCoins: 0,
      bonusXp: 8,
      labels: ['Warrior Fitness XP', 'Warrior Hard XP'],
    });
  });

  it('applies Scholar Learning coin bonus', () => {
    expect(
      getClassRewardModifiers(
        createPlayer('scholar'),
        createQuest({ coinReward: 6 }),
        createHabit({ category: 'learning' }),
      ),
    ).toEqual({
      bonusCoins: 1,
      bonusXp: 0,
      labels: ['Scholar Learning Coins'],
    });
  });
});
