import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/core/components/AppScreen';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import {
  habitCategoryOptions,
  habitDifficultyOptions,
  habitFrequencyOptions,
  weekdayOptions,
} from '@/core/constants/habitOptions';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import type {
  Habit,
  HabitCategory,
  HabitDifficulty,
  HabitFrequencyType,
  Weekday,
} from '@/data/models/habit';
import { habitRepository } from '@/data/repositories/habitRepository';
import { createHabit } from '@/features/habits/createHabit';

export default function HabitFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editingHabit = useMemo(() => (id ? habitRepository.getById(id) : null), [id]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('fitness');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('easy');
  const [frequencyType, setFrequencyType] = useState<HabitFrequencyType>('daily');
  const [selectedWeekdays, setSelectedWeekdays] = useState<Weekday[]>([]);
  const [targetCount, setTargetCount] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    if (!editingHabit) {
      return;
    }

    setTitle(editingHabit.title);
    setCategory(editingHabit.category);
    setDifficulty(editingHabit.difficulty);
    setFrequencyType(editingHabit.frequencyType);
    setSelectedWeekdays(editingHabit.selectedWeekdays);
    setTargetCount(editingHabit.targetCount ? String(editingHabit.targetCount) : '');
    setReminderTime(editingHabit.reminderTime ?? '');
  }, [editingHabit]);

  const normalizedTitle = title.trim();
  const parsedTargetCount = targetCount.trim() ? Number.parseInt(targetCount, 10) : undefined;
  const hasValidTargetCount =
    parsedTargetCount === undefined || (!Number.isNaN(parsedTargetCount) && parsedTargetCount > 0);
  const hasValidWeekdays = frequencyType === 'daily' || selectedWeekdays.length > 0;
  const canSave = normalizedTitle.length >= 2 && hasValidTargetCount && hasValidWeekdays;

  const toggleWeekday = (weekday: Weekday) => {
    setSelectedWeekdays((current) =>
      current.includes(weekday)
        ? current.filter((item) => item !== weekday)
        : [...current, weekday].sort(),
    );
  };

  const saveHabit = () => {
    if (!canSave) {
      return;
    }

    const habit = createHabit({
      id: editingHabit?.id,
      title: normalizedTitle,
      category,
      difficulty,
      frequencyType,
      selectedWeekdays,
      targetCount: parsedTargetCount,
      reminderTime,
      createdAt: editingHabit?.createdAt,
      isActive: editingHabit?.isActive ?? true,
    });

    habitRepository.upsert(habit);
    router.replace('/habits');
  };

  return (
    <AppScreen canGoBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.eyebrow}>{editingHabit ? 'Edit Habit' : 'Create Habit'}</Text>
          <Text style={styles.title}>Build a quest source</Text>
          <Text style={styles.body}>
            Habits define the real-life actions that will become daily quests.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            maxLength={48}
            onChangeText={setTitle}
            placeholder="Read 20 minutes"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={title}
          />
        </View>

        <OptionGroup
          label="Category"
          options={habitCategoryOptions}
          selectedValue={category}
          onSelect={setCategory}
        />

        <OptionGroup
          label="Difficulty"
          options={habitDifficultyOptions}
          selectedValue={difficulty}
          onSelect={setDifficulty}
        />

        <OptionGroup
          label="Frequency"
          options={habitFrequencyOptions}
          selectedValue={frequencyType}
          onSelect={setFrequencyType}
        />

        {frequencyType === 'selectedDays' ? (
          <View style={styles.field}>
            <Text style={styles.label}>Weekdays</Text>
            <View style={styles.optionWrap}>
              {weekdayOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => toggleWeekday(option.value)}
                  style={[
                    styles.chip,
                    selectedWeekdays.includes(option.value) ? styles.chipSelected : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedWeekdays.includes(option.value) ? styles.chipTextSelected : null,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.fieldGrid}>
          <View style={styles.gridField}>
            <Text style={styles.label}>Target count</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setTargetCount}
              placeholder="Optional"
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={targetCount}
            />
          </View>
          <View style={styles.gridField}>
            <Text style={styles.label}>Reminder</Text>
            <TextInput
              onChangeText={setReminderTime}
              placeholder="HH:mm"
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={reminderTime}
            />
          </View>
        </View>

        {!hasValidTargetCount ? (
          <Text style={styles.errorText}>Target count must be a positive number.</Text>
        ) : null}
        {!hasValidWeekdays ? (
          <Text style={styles.errorText}>Choose at least one weekday.</Text>
        ) : null}

        <PrimaryButton label={editingHabit ? 'Save Habit' : 'Create Habit'} onPress={saveHabit} />
      </ScrollView>
    </AppScreen>
  );
}

type OptionGroupProps<T extends string> = {
  label: string;
  options: Array<{ value: T; label: string }>;
  selectedValue: T;
  onSelect: (value: T) => void;
};

function OptionGroup<T extends string>({
  label,
  options,
  selectedValue,
  onSelect,
}: OptionGroupProps<T>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionWrap}>
        {options.map((option) => {
          const selected = option.value === selectedValue;

          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[styles.chip, selected ? styles.chipSelected : null]}
            >
              <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  chipSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  chipTextSelected: {
    color: colors.surface,
  },
  fieldGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  gridField: {
    flex: 1,
    gap: spacing.sm,
  },
  errorText: {
    color: '#A6423A',
    fontSize: 13,
    fontWeight: '800',
  },
});
