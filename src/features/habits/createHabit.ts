import type {
  Habit,
  HabitCategory,
  HabitDifficulty,
  HabitFrequencyType,
  Weekday,
} from '@/data/models/habit';

type CreateHabitInput = {
  id?: string;
  title: string;
  category: HabitCategory;
  difficulty: HabitDifficulty;
  frequencyType: HabitFrequencyType;
  selectedWeekdays: Weekday[];
  targetCount?: number;
  reminderTime?: string;
  createdAt?: string;
  isActive?: boolean;
};

function createId() {
  return `habit-${Date.now()}`;
}

export function createHabit(input: CreateHabitInput): Habit {
  const now = new Date().toISOString();

  return {
    id: input.id ?? createId(),
    title: input.title.trim(),
    category: input.category,
    difficulty: input.difficulty,
    frequencyType: input.frequencyType,
    selectedWeekdays:
      input.frequencyType === 'selectedDays' ? input.selectedWeekdays : [],
    targetCount: input.targetCount,
    reminderTime: input.reminderTime?.trim() || undefined,
    isActive: input.isActive ?? true,
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };
}
