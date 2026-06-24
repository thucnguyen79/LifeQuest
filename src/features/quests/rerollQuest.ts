import type { Quest, QuestEnergy } from '@/data/models/quest';

export type QuestRerollResult = {
  quest: Quest;
  rerolled: boolean;
};

const lighterEnergy: Record<QuestEnergy, QuestEnergy> = {
  heavy: 'medium',
  light: 'light',
  medium: 'light',
};

export function rerollPendingQuest(
  quest: Quest,
  rerolledAt = new Date().toISOString(),
): QuestRerollResult {
  if (quest.status !== 'pending' || quest.rerolledAt) {
    return { quest, rerolled: false };
  }

  const progressCount = Math.max(quest.progressCount ?? 0, 0);
  const targetCount = Math.max(quest.targetCount ?? 1, 1);

  return {
    rerolled: true,
    quest: {
      ...quest,
      energy: lighterEnergy[quest.energy ?? 'medium'],
      estimatedMinutes: quest.estimatedMinutes
        ? Math.max(Math.ceil(quest.estimatedMinutes * 0.75), 5)
        : undefined,
      rerolledAt,
      targetCount: Math.max(targetCount - 1, progressCount + 1, 1),
    },
  };
}
