import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppScreen } from '@/core/components/AppScreen';
import { ProgressBar } from '@/core/components/ProgressBar';
import { StatPill } from '@/core/components/StatPill';
import { characterClasses } from '@/core/constants/gameRules';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

const navItems = [
  { label: 'Habits', route: '/habits', icon: '+' },
  { label: 'Pet', route: '/companion', icon: 'P' },
  { label: 'Rewards', route: '/rewards', icon: '$' },
  { label: 'Settings', route: '/settings', icon: '*' },
] as const;

export default function DashboardScreen() {
  const player = useLifeQuestStore((state) => state.player);
  const dailyQuests = useLifeQuestStore((state) => state.dailyQuests);
  const activePet = useLifeQuestStore((state) => state.activePet);
  const streakSummary = useLifeQuestStore((state) => state.streakSummary);
  const rewardFeedback = useLifeQuestStore((state) => state.rewardFeedback);
  const generateTodayQuests = useLifeQuestStore((state) => state.generateTodayQuests);
  const completeQuest = useLifeQuestStore((state) => state.completeQuest);
  const dismissRewardFeedback = useLifeQuestStore((state) => state.dismissRewardFeedback);

  useFocusEffect(
    useCallback(() => {
      generateTodayQuests();
    }, [generateTodayQuests]),
  );

  if (!player) {
    return <Redirect href="/" />;
  }

  const playerClass = characterClasses[player.selectedClass];

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Daily Adventure</Text>
            <Text style={styles.title}>Welcome, {player.name}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv {player.level}</Text>
          </View>
        </View>

        <Animated.View entering={FadeIn.duration(350)} style={styles.heroCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{playerClass.icon}</Text>
            </View>
            <View style={styles.avatarInfo}>
              <Text style={styles.className}>{playerClass.name}</Text>
              <Text style={styles.classCopy}>XP turns real life into character growth.</Text>
            </View>
          </View>
          <ProgressBar current={player.currentXp} label={`${player.currentXp} / 100 XP`} max={100} />
          <Text style={styles.coinText}>{player.coins} coins</Text>
        </Animated.View>

        {rewardFeedback ? (
          <Animated.View entering={FadeIn.duration(250)} style={styles.rewardCard}>
            <View style={styles.rewardCopy}>
              <Text style={styles.rewardEyebrow}>
                {rewardFeedback.leveledUp ? 'Level Up' : 'Quest Complete'}
              </Text>
              <Text style={styles.rewardTitle}>
                {rewardFeedback.leveledUp
                  ? `Level ${rewardFeedback.previousLevel} -> ${rewardFeedback.newLevel}`
                  : `+${rewardFeedback.xpGained} XP earned`}
              </Text>
              <Text style={styles.rewardBody}>
                +{rewardFeedback.xpGained} XP / +{rewardFeedback.coinsGained} coins
              </Text>
            </View>
            <Pressable onPress={dismissRewardFeedback} style={styles.rewardDismiss}>
              <Text style={styles.rewardDismissText}>OK</Text>
            </Pressable>
          </Animated.View>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <Text style={styles.sectionMeta}>MVP preview</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatPill label="STR" value={player.strength} />
          <StatPill label="INT" value={player.intelligence} />
          <StatPill label="FOC" value={player.focus} />
          <StatPill label="WIS" value={player.wisdom} />
          <StatPill label="CHA" value={player.charisma} />
          <StatPill label="DIS" value={player.discipline} />
        </View>

        <View style={styles.previewGrid}>
          <Pressable onPress={() => router.push('/companion')} style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewEyebrow}>Companion</Text>
              <View style={styles.previewIcon}>
                <Text style={styles.previewIconText}>P</Text>
              </View>
            </View>
            <Text style={styles.previewTitle}>{activePet.name}</Text>
            <Text style={styles.previewBody}>
              Lv {activePet.level} {activePet.type} / {activePet.mood} / {activePet.growthStage}
            </Text>
          </Pressable>

          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewEyebrow}>Streak</Text>
              <View style={styles.previewIcon}>
                <Text style={styles.previewIconText}>S</Text>
              </View>
            </View>
            <Text style={styles.previewTitle}>{streakSummary.currentStreak} days</Text>
            <Text style={styles.previewBody}>
              Longest streak: {streakSummary.longestStreak} days
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today Quests</Text>
          <Text style={styles.sectionMeta}>Generated from habits</Text>
        </View>
        {dailyQuests.length === 0 ? (
          <View style={styles.emptyQuestCard}>
            <Text style={styles.emptyQuestTitle}>No quests today</Text>
            <Text style={styles.emptyQuestBody}>
              Add an active habit to generate today&apos;s quest list.
            </Text>
            <Pressable onPress={() => router.push('/habits')} style={styles.emptyQuestButton}>
              <Text style={styles.emptyQuestButtonText}>Create Habit</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.questList}>
            {dailyQuests.map((quest) => (
              <View key={quest.id} style={styles.questCard}>
                <View style={styles.questCopy}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questReward}>
                    +{quest.xpReward} XP / +{quest.coinReward} coins
                  </Text>
                </View>
                {quest.status === 'completed' ? (
                  <View style={[styles.questStatus, styles.questStatusCompleted]}>
                    <Text style={styles.questStatusText}>Done</Text>
                  </View>
                ) : (
                  <Pressable onPress={() => completeQuest(quest.id)} style={styles.completeButton}>
                    <Text style={styles.completeButtonText}>Complete</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.navGrid}>
          {navItems.map((item) => (
            <Pressable key={item.route} onPress={() => router.push(item.route)} style={styles.navCard}>
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={styles.navLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  levelBadge: {
    backgroundColor: colors.ink,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  levelText: {
    color: colors.surface,
    fontWeight: '900',
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  avatarRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 8,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  avatarText: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
  },
  avatarInfo: {
    flex: 1,
  },
  className: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  classCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  coinText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  rewardCard: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  rewardCopy: {
    flex: 1,
  },
  rewardEyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  rewardTitle: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  rewardBody: {
    color: colors.goldSoft,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  rewardDismiss: {
    alignItems: 'center',
    backgroundColor: colors.gold,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  rewardDismissText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  sectionHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  sectionMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    gap: spacing.sm,
    minHeight: 128,
    padding: spacing.md,
  },
  previewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewEyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  previewIcon: {
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  previewIconText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  previewTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  previewBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  questList: {
    gap: spacing.sm,
  },
  emptyQuestCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  emptyQuestTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  emptyQuestBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyQuestButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: spacing.xs,
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  emptyQuestButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '900',
  },
  questCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  questCopy: {
    flex: 1,
  },
  questTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  questReward: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  questStatus: {
    backgroundColor: colors.goldSoft,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  questStatusCompleted: {
    backgroundColor: colors.mint,
  },
  questStatusText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '800',
  },
  completeButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  completeButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '900',
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  navCard: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    flexBasis: '48%',
    flexGrow: 1,
    gap: spacing.xs,
    justifyContent: 'center',
    minHeight: 88,
  },
  navIcon: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '900',
  },
  navLabel: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
});
