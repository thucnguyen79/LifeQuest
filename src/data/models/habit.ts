export type HabitCategory = 'fitness' | 'learning' | 'deepWork' | 'meditation' | 'social';

export type HabitDifficulty = 'easy' | 'medium' | 'hard';

export type HabitFrequencyType = 'daily' | 'selectedDays';

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Habit = {
  id: string;
  title: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  frequencyType: HabitFrequencyType;
  selectedWeekdays: Weekday[];
  targetCount?: number;
  reminderTime?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
