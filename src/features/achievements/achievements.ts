import type { GameIconName } from '@/core/components/GameIcon';

export type AchievementId = 'coins100' | 'learning10' | 'petLevel5' | 'streak7';

export type AchievementProgressRecord = {
  lifetimeCoinsEarned: number;
  unlockedAtById: Partial<Record<AchievementId, string>>;
};

export type AchievementContext = {
  completedLearningQuests: number;
  currentCoins: number;
  longestStreak: number;
  petLevel: number;
};

export type AchievementState = {
  body: string;
  current: number;
  icon: GameIconName;
  id: AchievementId;
  target: number;
  title: string;
  unlocked: boolean;
  unlockedAt?: string;
};

type AchievementDefinition = Omit<AchievementState, 'current' | 'unlocked' | 'unlockedAt'> & {
  getCurrent: (context: AchievementContext, record: AchievementProgressRecord) => number;
};

export const defaultAchievementProgress: AchievementProgressRecord = {
  lifetimeCoinsEarned: 0,
  unlockedAtById: {},
};

const achievementDefinitions: AchievementDefinition[] = [
  {
    body: 'Reach a seven-day streak.',
    getCurrent: (context) => context.longestStreak,
    icon: 'flame',
    id: 'streak7',
    target: 7,
    title: 'Seven Day Flame',
  },
  {
    body: 'Complete ten Learning quests.',
    getCurrent: (context) => context.completedLearningQuests,
    icon: 'book',
    id: 'learning10',
    target: 10,
    title: "Scholar's Mark",
  },
  {
    body: 'Raise Mochi to level five.',
    getCurrent: (context) => context.petLevel,
    icon: 'petDragon',
    id: 'petLevel5',
    target: 5,
    title: 'Bond Keeper',
  },
  {
    body: 'Earn one hundred lifetime coins.',
    getCurrent: (_context, record) => record.lifetimeCoinsEarned,
    icon: 'coin',
    id: 'coins100',
    target: 100,
    title: 'First Fortune',
  },
];

export function normalizeAchievementProgress(
  record?: Partial<AchievementProgressRecord>,
): AchievementProgressRecord {
  return {
    lifetimeCoinsEarned: Math.max(record?.lifetimeCoinsEarned ?? 0, 0),
    unlockedAtById: record?.unlockedAtById ?? {},
  };
}

export function addLifetimeCoins(
  record: AchievementProgressRecord,
  coinsEarned: number,
): AchievementProgressRecord {
  return {
    ...record,
    lifetimeCoinsEarned: record.lifetimeCoinsEarned + Math.max(coinsEarned, 0),
  };
}

export function syncAchievementProgress(
  sourceRecord: AchievementProgressRecord,
  context: AchievementContext,
  unlockedAt = new Date().toISOString(),
) {
  const record = normalizeAchievementProgress({
    ...sourceRecord,
    lifetimeCoinsEarned: Math.max(sourceRecord.lifetimeCoinsEarned, context.currentCoins),
  });
  const nextUnlockedAtById = { ...record.unlockedAtById };
  const newlyUnlockedIds: AchievementId[] = [];

  const achievements = achievementDefinitions.map((definition): AchievementState => {
    const current = Math.max(definition.getCurrent(context, record), 0);

    if (current >= definition.target && !nextUnlockedAtById[definition.id]) {
      nextUnlockedAtById[definition.id] = unlockedAt;
      newlyUnlockedIds.push(definition.id);
    }

    return {
      body: definition.body,
      current,
      icon: definition.icon,
      id: definition.id,
      target: definition.target,
      title: definition.title,
      unlocked: Boolean(nextUnlockedAtById[definition.id]),
      unlockedAt: nextUnlockedAtById[definition.id],
    };
  });

  return {
    achievements,
    newlyUnlockedIds,
    record: {
      ...record,
      unlockedAtById: nextUnlockedAtById,
    },
  };
}
