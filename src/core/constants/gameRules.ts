import type { HabitCategory, HabitDifficulty } from '@/data/models/habit';
import type { PlayerClass, StatKey } from '@/data/models/player';

export const characterClasses: Record<
  PlayerClass,
  {
    name: string;
    description: string;
    icon: string;
    primaryStat: StatKey;
  }
> = {
  warrior: {
    name: 'Warrior',
    description: 'Fitness, health, and physical resilience.',
    icon: 'W',
    primaryStat: 'strength',
  },
  scholar: {
    name: 'Scholar',
    description: 'Reading, study, research, and learning.',
    icon: 'S',
    primaryStat: 'intelligence',
  },
  monk: {
    name: 'Monk',
    description: 'Meditation, focus, and inner growth.',
    icon: 'M',
    primaryStat: 'wisdom',
  },
  creator: {
    name: 'Creator',
    description: 'Writing, design, building, and creative work.',
    icon: 'C',
    primaryStat: 'focus',
  },
  explorer: {
    name: 'Explorer',
    description: 'Social habits, experiences, and connection.',
    icon: 'E',
    primaryStat: 'charisma',
  },
};

export const xpRewardByDifficulty: Record<HabitDifficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 35,
};

export const coinRewardByDifficulty: Record<HabitDifficulty, number> = {
  easy: 3,
  medium: 6,
  hard: 10,
};

export const statByHabitCategory: Record<HabitCategory, StatKey> = {
  fitness: 'strength',
  learning: 'intelligence',
  deepWork: 'focus',
  meditation: 'wisdom',
  social: 'charisma',
};

export function calculateLevel(totalXp: number) {
  return Math.floor(totalXp / 100) + 1;
}
