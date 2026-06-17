import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/core/components/AppScreen';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import {
  habitCategoryOptions,
  habitDifficultyOptions,
  habitEnergyOptions,
  habitFrequencyOptions,
  habitPriorityOptions,
  weekdayOptions,
} from '@/core/constants/habitOptions';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import type {
  Habit,
  HabitCategory,
  HabitDifficulty,
  HabitEnergy,
  HabitFrequencyType,
  HabitPriority,
  Weekday,
} from '@/data/models/habit';
import { habitRepository } from '@/data/repositories/habitRepository';
import { createHabit } from '@/features/habits/createHabit';
import { reconcileHabitQuestForDate } from '@/features/habits/reconcileHabitQuest';
import { isValidReminderTime } from '@/features/notifications/habitReminders';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

export default function HabitFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editingHabit = useMemo(() => (id ? habitRepository.getById(id) : null), [id]);
  const generateTodayQuests = useLifeQuestStore((state) => state.generateTodayQuests);
  const rescheduleNotifications = useLifeQuestStore((state) => state.rescheduleNotifications);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('fitness');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>('easy');
  const [priority, setPriority] = useState<HabitPriority>('normal');
  const [energy, setEnergy] = useState<HabitEnergy>('medium');
  const [frequencyType, setFrequencyType] = useState<HabitFrequencyType>('daily');
  const [selectedWeekdays, setSelectedWeekdays] = useState<Weekday[]>([]);
  const [targetCount, setTargetCount] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [bonusObjective, setBonusObjective] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    if (!editingHabit) {
      return;
    }

    setTitle(editingHabit.title);
    setCategory(editingHabit.category);
    setDifficulty(editingHabit.difficulty);
    setPriority(editingHabit.priority ?? 'normal');
    setEnergy(editingHabit.energy ?? 'medium');
    setFrequencyType(editingHabit.frequencyType);
    setSelectedWeekdays(editingHabit.selectedWeekdays);
    setTargetCount(editingHabit.targetCount ? String(editingHabit.targetCount) : '');
    setEstimatedMinutes(
      editingHabit.estimatedMinutes ? String(editingHabit.estimatedMinutes) : '',
    );
    setBonusObjective(editingHabit.bonusObjective ?? '');
    setReminderTime(editingHabit.reminderTime ?? '');
  }, [editingHabit]);

  const normalizedTitle = title.trim();
  const normalizedReminderTime = reminderTime.trim();
  const normalizedBonusObjective = bonusObjective.trim();
  const parsedTargetCount = targetCount.trim() ? Number.parseInt(targetCount, 10) : undefined;
  const parsedEstimatedMinutes = estimatedMinutes.trim()
    ? Number.parseInt(estimatedMinutes, 10)
    : undefined;
  const hasValidTitle = normalizedTitle.length >= 2;
  const hasValidTargetCount =
    parsedTargetCount === undefined || (!Number.isNaN(parsedTargetCount) && parsedTargetCount > 0);
  const hasValidEstimatedMinutes =
    parsedEstimatedMinutes === undefined ||
    (!Number.isNaN(parsedEstimatedMinutes) && parsedEstimatedMinutes > 0);
  const hasValidWeekdays = frequencyType === 'daily' || selectedWeekdays.length > 0;
  const hasValidReminderTime = isValidReminderTime(reminderTime);
  const canSave =
    hasValidTitle &&
    hasValidTargetCount &&
    hasValidEstimatedMinutes &&
    hasValidWeekdays &&
    hasValidReminderTime;

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
      priority,
      energy,
      frequencyType,
      selectedWeekdays,
      targetCount: parsedTargetCount,
      estimatedMinutes: parsedEstimatedMinutes,
      bonusObjective: normalizedBonusObjective || undefined,
      reminderTime: normalizedReminderTime || undefined,
      createdAt: editingHabit?.createdAt,
      isActive: editingHabit?.isActive ?? true,
    });

    habitRepository.upsert(habit);
    reconcileHabitQuestForDate(habit);
    generateTodayQuests();
    void rescheduleNotifications();
    router.replace('/habits');
  };

  return (
    <AppScreen backTo="/habits" canGoBack>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
            placeholder="Type a habit title"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={title}
          />
        </View>
        {title.length === 0 ? (
          <Text style={styles.helperText}>Example: Read 20 minutes.</Text>
        ) : null}
        {title.length > 0 && !hasValidTitle ? (
          <Text style={styles.errorText}>Title must be at least 2 characters.</Text>
        ) : null}

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
          label="Priority"
          options={habitPriorityOptions}
          selectedValue={priority}
          onSelect={setPriority}
        />

        <OptionGroup
          label="Energy"
          options={habitEnergyOptions}
          selectedValue={energy}
          onSelect={setEnergy}
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
            <Text style={styles.label}>Estimated min</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setEstimatedMinutes}
              placeholder="Optional"
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={estimatedMinutes}
            />
          </View>
        </View>

        <View style={styles.fieldGrid}>
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
          <View style={styles.gridField}>
            <Text style={styles.label}>Bonus objective</Text>
            <TextInput
              maxLength={64}
              onChangeText={setBonusObjective}
              placeholder="Optional"
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={bonusObjective}
            />
          </View>
        </View>

        {!hasValidTargetCount ? (
          <Text style={styles.errorText}>Target count must be a positive number.</Text>
        ) : null}
        {!hasValidEstimatedMinutes ? (
          <Text style={styles.errorText}>Estimated minutes must be a positive number.</Text>
        ) : null}
        {!hasValidWeekdays ? (
          <Text style={styles.errorText}>Choose at least one weekday.</Text>
        ) : null}
        {!hasValidReminderTime ? (
          <Text style={styles.errorText}>Reminder must use 24-hour HH:mm format.</Text>
        ) : null}

        <PrimaryButton
          disabled={!canSave}
          label={editingHabit ? 'Save Habit' : 'Create Habit'}
          onPress={saveHabit}
        />
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
    paddingBottom: spacing.xl * 3,
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
  helperText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: -spacing.md,
  },
});
