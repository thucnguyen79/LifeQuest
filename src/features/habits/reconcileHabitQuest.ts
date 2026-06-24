import { coinRewardByDifficulty, xpRewardByDifficulty } from '@/core/constants/gameRules';
import type { Habit, Weekday } from '@/data/models/habit';
import type { Quest } from '@/data/models/quest';
import { questRepository } from '@/data/repositories/questRepository';
import { getTodayDateKey, getWeekdayFromDateKey } from '@/features/quests/dateUtils';

function getQuestId(habitId: string, dateKey: string) {
  return `quest-${habitId}-${dateKey}`;
}

function isHabitDueOnDate(habit: Habit, dateKey: string) {
  if (!habit.isActive) {
    return false;
  }

  if (habit.frequencyType === 'daily') {
    return true;
  }

  const weekday: Weekday = getWeekdayFromDateKey(dateKey);
  return habit.selectedWeekdays.includes(weekday);
}

function createQuestFromHabit(habit: Habit, dateKey: string, existingQuest?: Quest | null): Quest {
  const targetCount = Math.max(habit.targetCount ?? 1, 1);

  return {
    coinReward: coinRewardByDifficulty[habit.difficulty],
    category: habit.category,
    date: dateKey,
    habitId: habit.id,
    id: getQuestId(habit.id, dateKey),
    targetCount,
    progressCount: 0,
    priority: habit.priority ?? 'normal',
    energy: habit.energy ?? 'medium',
    estimatedMinutes: habit.estimatedMinutes,
    bonusObjective: habit.bonusObjective,
    bonusCompleted: existingQuest?.bonusCompleted ?? false,
    status: 'pending',
    title: habit.title,
    xpReward: xpRewardByDifficulty[habit.difficulty],
  };
}

export function reconcileHabitQuestForDate(habit: Habit, dateKey = getTodayDateKey()) {
  const existingQuest = questRepository.getById(getQuestId(habit.id, dateKey));

  if (existingQuest && existingQuest.status !== 'pending') {
    return existingQuest;
  }

  if (!isHabitDueOnDate(habit, dateKey)) {
    if (existingQuest?.status === 'pending') {
      questRepository.remove(existingQuest.id);
    }

    return null;
  }

  const nextQuest = createQuestFromHabit(habit, dateKey, existingQuest);
  questRepository.upsert(nextQuest);
  return nextQuest;
}
