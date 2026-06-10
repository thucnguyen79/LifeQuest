import { coinRewardByDifficulty, xpRewardByDifficulty } from '@/core/constants/gameRules';
import type { Habit } from '@/data/models/habit';
import type { Quest } from '@/data/models/quest';
import { habitRepository } from '@/data/repositories/habitRepository';
import { questRepository } from '@/data/repositories/questRepository';
import { getTodayDateKey, getWeekdayFromDateKey } from '@/features/quests/dateUtils';

function isHabitDueOnDate(habit: Habit, dateKey: string) {
  if (habit.frequencyType === 'daily') {
    return true;
  }

  const weekday = getWeekdayFromDateKey(dateKey);
  return habit.selectedWeekdays.includes(weekday);
}

function createQuestFromHabit(habit: Habit, dateKey: string): Quest {
  return {
    id: `quest-${habit.id}-${dateKey}`,
    habitId: habit.id,
    title: habit.title,
    date: dateKey,
    xpReward: xpRewardByDifficulty[habit.difficulty],
    coinReward: coinRewardByDifficulty[habit.difficulty],
    status: 'pending',
  };
}

export function generateDailyQuests(dateKey = getTodayDateKey()) {
  const activeHabits = habitRepository.listActive();
  const existingQuests = questRepository.listByDate(dateKey);
  const existingHabitIds = new Set(existingQuests.map((quest) => quest.habitId));

  activeHabits
    .filter((habit) => isHabitDueOnDate(habit, dateKey))
    .filter((habit) => !existingHabitIds.has(habit.id))
    .forEach((habit) => {
      questRepository.upsert(createQuestFromHabit(habit, dateKey));
    });

  return questRepository.listByDate(dateKey);
}
