import type {
  HabitCategory,
  HabitDifficulty,
  HabitFrequencyType,
  Weekday,
} from '@/data/models/habit';

export const habitCategoryOptions: Array<{
  value: HabitCategory;
  label: string;
}> = [
  { value: 'fitness', label: 'Fitness' },
  { value: 'learning', label: 'Learning' },
  { value: 'deepWork', label: 'Deep Work' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'social', label: 'Social' },
];

export const habitDifficultyOptions: Array<{
  value: HabitDifficulty;
  label: string;
}> = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export const habitFrequencyOptions: Array<{
  value: HabitFrequencyType;
  label: string;
}> = [
  { value: 'daily', label: 'Daily' },
  { value: 'selectedDays', label: 'Selected Days' },
];

export const weekdayOptions: Array<{
  value: Weekday;
  label: string;
}> = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 7, label: 'Sun' },
];

export function getHabitCategoryLabel(category: HabitCategory) {
  return habitCategoryOptions.find((option) => option.value === category)?.label ?? category;
}

export function getHabitDifficultyLabel(difficulty: HabitDifficulty) {
  return habitDifficultyOptions.find((option) => option.value === difficulty)?.label ?? difficulty;
}
