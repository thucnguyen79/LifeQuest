import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/core/components/AppScreen';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import {
  getHabitCategoryLabel,
  getHabitDifficultyLabel,
} from '@/core/constants/habitOptions';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import type { Habit } from '@/data/models/habit';
import { habitRepository } from '@/data/repositories/habitRepository';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const rescheduleNotifications = useLifeQuestStore((state) => state.rescheduleNotifications);

  const loadHabits = useCallback(() => {
    setHabits(habitRepository.listActive());
  }, []);

  useFocusEffect(loadHabits);

  const archiveHabit = (habitId: string) => {
    habitRepository.deactivate(habitId);
    void rescheduleNotifications();
    loadHabits();
  };

  return (
    <AppScreen canGoBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Habits</Text>
            <Text style={styles.title}>Quest sources</Text>
            <Text style={styles.body}>Active habits become daily quests and reminder sources.</Text>
          </View>
          <Pressable onPress={() => router.push('/habit-form')} style={styles.iconButton}>
            <Text style={styles.iconButtonText}>+</Text>
          </Pressable>
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No active habits yet</Text>
            <Text style={styles.emptyBody}>
              Create one habit to start shaping your character progression.
            </Text>
            <PrimaryButton label="Create Habit" onPress={() => router.push('/habit-form')} />
          </View>
        ) : (
          <View style={styles.list}>
            {habits.map((habit) => (
              <View key={habit.id} style={styles.habitCard}>
                <View style={styles.habitTopRow}>
                  <View style={styles.habitCopy}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    <Text style={styles.habitMeta}>
                      {getHabitCategoryLabel(habit.category)} /{' '}
                      {getHabitDifficultyLabel(habit.difficulty)}
                    </Text>
                  </View>
                  <View style={styles.frequencyBadge}>
                    <Text style={styles.frequencyText}>
                      {habit.frequencyType === 'daily' ? 'Daily' : 'Selected'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailText}>
                    Target: {habit.targetCount ? `${habit.targetCount}x` : 'none'}
                  </Text>
                  <Text style={styles.detailText}>
                    Reminder: {habit.reminderTime ?? 'none'}
                  </Text>
                  <Text style={styles.detailText}>
                    Frequency: {habit.frequencyType === 'daily' ? 'daily' : 'selected days'}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <Pressable
                    onPress={() =>
                      router.push({ pathname: '/habit-form', params: { id: habit.id } })
                    }
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable onPress={() => archiveHabit(habit.id)} style={styles.archiveButton}>
                    <Text style={styles.archiveButtonText}>Archive</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
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
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  iconButtonText: {
    color: colors.surface,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 28,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    gap: spacing.md,
  },
  habitCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  habitTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  habitCopy: {
    flex: 1,
  },
  habitTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  habitMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  frequencyBadge: {
    backgroundColor: colors.goldSoft,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  frequencyText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  detailText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  secondaryButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  archiveButton: {
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  archiveButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
});
