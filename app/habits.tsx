import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/core/components/AppScreen';
import { EmptyState } from '@/core/components/EmptyState';
import { GameBadge } from '@/core/components/GameBadge';
import { GameIcon } from '@/core/components/GameIcon';
import type { GameIconName } from '@/core/components/GameIcon';
import { GamePanel } from '@/core/components/GamePanel';
import {
  getHabitCategoryLabel,
  getHabitDifficultyLabel,
} from '@/core/constants/habitOptions';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import type { Habit } from '@/data/models/habit';
import { habitRepository } from '@/data/repositories/habitRepository';
import { reconcileHabitQuestForDate } from '@/features/habits/reconcileHabitQuest';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

const categoryIcon: Record<Habit['category'], GameIconName> = {
  deepWork: 'focus',
  fitness: 'shield',
  learning: 'book',
  meditation: 'moon',
  social: 'spark',
};

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const generateTodayQuests = useLifeQuestStore((state) => state.generateTodayQuests);
  const rescheduleNotifications = useLifeQuestStore((state) => state.rescheduleNotifications);

  const loadHabits = useCallback(() => {
    setHabits(habitRepository.listActive());
  }, []);

  useFocusEffect(loadHabits);

  const archiveHabit = (habitId: string) => {
    const habit = habitRepository.getById(habitId);

    if (!habit) {
      return;
    }

    const archivedHabit = {
      ...habit,
      isActive: false,
      updatedAt: new Date().toISOString(),
    };

    habitRepository.upsert(archivedHabit);
    reconcileHabitQuestForDate(archivedHabit);
    generateTodayQuests();
    void rescheduleNotifications();
    loadHabits();
  };

  return (
    <AppScreen backTo="/dashboard" canGoBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Habits</Text>
            <Text style={styles.title}>Quest sources</Text>
            <Text style={styles.body}>Active habits become daily quests and reminder sources.</Text>
          </View>
          <Pressable onPress={() => router.replace('/habit-form')} style={styles.iconButton}>
            <GameIcon name="habit" size={34} tone="mint" />
          </Pressable>
        </View>

        {habits.length === 0 ? (
          <EmptyState
            actionLabel="Create Habit"
            body="Create one habit to turn real life into daily quests, XP, and pet bond progress."
            title="No quest sources yet"
            visual={<GameIcon name="scroll" size={76} tone="dark" />}
            onAction={() => router.replace('/habit-form')}
          />
        ) : (
          <View style={styles.list}>
            {habits.map((habit) => (
              <GamePanel accent key={habit.id} tone="parchment" style={styles.habitCard}>
                <View style={styles.habitTopRow}>
                  <GameIcon name={categoryIcon[habit.category]} size={48} tone="mint" />
                  <View style={styles.habitCopy}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    <Text style={styles.habitMeta}>
                      {getHabitCategoryLabel(habit.category)}
                    </Text>
                  </View>
                  <GameBadge
                    label={habit.frequencyType === 'daily' ? 'Daily' : 'Selected'}
                    tone="gold"
                  />
                </View>

                <View style={styles.detailRow}>
                  <GameBadge label={getHabitDifficultyLabel(habit.difficulty)} tone="accent" />
                  <GameBadge
                    label={`Target ${habit.targetCount ? `${habit.targetCount}x` : 'none'}`}
                    tone="muted"
                  />
                  <GameBadge label={`Reminder ${habit.reminderTime ?? 'none'}`} tone="muted" />
                </View>

                <View style={styles.actions}>
                  <Pressable
                    onPress={() =>
                      router.replace({ pathname: '/habit-form', params: { id: habit.id } })
                    }
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable onPress={() => archiveHabit(habit.id)} style={styles.archiveButton}>
                    <Text style={styles.archiveButtonText}>Archive</Text>
                  </Pressable>
                </View>
              </GamePanel>
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
  list: {
    gap: spacing.md,
  },
  habitCard: {
    gap: spacing.md,
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
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
