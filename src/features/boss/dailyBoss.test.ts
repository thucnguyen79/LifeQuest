import { describe, expect, it } from 'vitest';

import type { DailyAdventure } from '@/data/models/adventure';
import type { Quest } from '@/data/models/quest';

import { defeatedBossChestBonusCoins, getDailyBossState } from './dailyBoss';

const adventure: DailyAdventure = {
  cleared: true,
  date: '2026-06-18',
  nodeProgress: 4,
  nodeTarget: 4,
  updatedAt: '2026-06-18T00:00:00.000Z',
  zoneId: 'forestOfFocus',
};

const baseQuest: Quest = {
  category: 'deepWork',
  coinReward: 3,
  date: '2026-06-18',
  energy: 'medium',
  habitId: 'habit-1',
  id: 'quest-1',
  priority: 'normal',
  progressCount: 0,
  status: 'pending',
  targetCount: 2,
  title: 'Focus',
  xpReward: 10,
};

describe('getDailyBossState', () => {
  it('locks the boss until the adventure route is cleared', () => {
    const boss = getDailyBossState('2026-06-18', [baseQuest], {
      ...adventure,
      cleared: false,
      nodeProgress: 2,
    });

    expect(boss.status).toBe('locked');
    expect(boss.damage).toBe(0);
    expect(boss.chestBonusCoins).toBe(0);
  });

  it('tracks quest progress as boss damage', () => {
    const boss = getDailyBossState('2026-06-18', [{ ...baseQuest, progressCount: 1 }], adventure);

    expect(boss.status).toBe('active');
    expect(boss.damage).toBe(6);
    expect(boss.currentHp).toBeGreaterThan(0);
  });

  it('defeats the boss and unlocks chest bonus when all damage is dealt', () => {
    const boss = getDailyBossState(
      '2026-06-18',
      [{ ...baseQuest, progressCount: 2, status: 'completed' }],
      adventure,
    );

    expect(boss.status).toBe('defeated');
    expect(boss.currentHp).toBe(0);
    expect(boss.chestBonusCoins).toBe(defeatedBossChestBonusCoins);
  });
});
