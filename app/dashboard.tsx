import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AppScreen } from '@/core/components/AppScreen';
import { EmptyState } from '@/core/components/EmptyState';
import { LevelUpBurst, PetIdleAnimation, QuestCompleteBurst } from '@/core/components/GameAnimation';
import { GameBadge } from '@/core/components/GameBadge';
import { GameIcon } from '@/core/components/GameIcon';
import type { GameIconName } from '@/core/components/GameIcon';
import { ProgressBar } from '@/core/components/ProgressBar';
import { StatPill } from '@/core/components/StatPill';
import { characterClasses } from '@/core/constants/gameRules';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import type { PlayerClass } from '@/data/models/player';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

const navItems = [
  { label: 'Habits', meta: 'Quest sources', route: '/habits', icon: 'habit' },
  { label: 'Pet', meta: 'Bond growth', route: '/companion', icon: 'petDragon' },
  { label: 'Rewards', meta: 'Coins & badges', route: '/rewards', icon: 'chest' },
  { label: 'Settings', meta: 'Preferences', route: '/settings', icon: 'gear' },
] as const;

const classIcons: Record<PlayerClass, GameIconName> = {
  creator: 'spark',
  explorer: 'compass',
  monk: 'moon',
  scholar: 'book',
  warrior: 'shield',
};

export default function DashboardScreen() {
  const player = useLifeQuestStore((state) => state.player);
  const dailyQuests = useLifeQuestStore((state) => state.dailyQuests);
  const activePet = useLifeQuestStore((state) => state.activePet);
  const streakSummary = useLifeQuestStore((state) => state.streakSummary);
  const dailyChest = useLifeQuestStore((state) => state.dailyChest);
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
  const completedQuestCount = dailyQuests.filter((quest) => quest.status === 'completed').length;
  const missedQuestCount = dailyQuests.filter((quest) => quest.status === 'missed').length;
  const totalQuestCount = dailyQuests.length;
  const allQuestsDone = totalQuestCount > 0 && completedQuestCount === totalQuestCount;
  const showLevelUpModal = rewardFeedback?.type === 'levelUp';

  return (
    <AppScreen>
      <Modal animationType="fade" transparent visible={showLevelUpModal}>
        <View style={styles.modalBackdrop}>
          <Animated.View entering={FadeInDown.duration(260)} style={styles.levelModal}>
            <LevelUpBurst size={116} />
            <Text style={styles.levelModalEyebrow}>Level Up</Text>
            <Text style={styles.levelModalTitle}>
              Lv {rewardFeedback?.previousLevel}
              {' -> '}
              Lv {rewardFeedback?.newLevel}
            </Text>
            <Text style={styles.levelModalBody}>
              +{rewardFeedback?.xpGained} XP / +{rewardFeedback?.coinsGained} coins
            </Text>
            <Pressable onPress={dismissRewardFeedback} style={styles.levelModalButton}>
              <Text style={styles.levelModalButtonText}>Continue</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
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
              <GameIcon name={classIcons[player.selectedClass]} size={84} tone="gold" />
            </View>
            <View style={styles.avatarInfo}>
              <Text style={styles.className}>{playerClass.name}</Text>
              <Text style={styles.classCopy}>Character growth powered by today&apos;s quests.</Text>
            </View>
          </View>
          <View style={styles.heroProgress}>
            <ProgressBar current={player.currentXp} label={`${player.currentXp} / 100 XP`} max={100} />
          </View>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipLabel}>Coins</Text>
              <Text style={styles.heroChipValue}>{player.coins}</Text>
            </View>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipLabel}>Quests</Text>
              <Text style={styles.heroChipValue}>
                {completedQuestCount}/{totalQuestCount}
              </Text>
            </View>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipLabel}>Chest</Text>
              <Text style={styles.heroChipValue}>
                {dailyChest.status === 'available'
                  ? 'Ready'
                  : dailyChest.status === 'claimed'
                    ? 'Claimed'
                    : 'Locked'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {rewardFeedback && !showLevelUpModal ? (
          <Animated.View entering={FadeIn.duration(250)} style={styles.rewardCard}>
            <View style={styles.rewardCopy}>
              <Text style={styles.rewardEyebrow}>{rewardFeedback.title}</Text>
              <Text style={styles.rewardTitle}>
                {rewardFeedback.xpGained > 0
                  ? `+${rewardFeedback.xpGained} XP earned`
                  : `+${rewardFeedback.coinsGained} coins`}
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
          <GameBadge label="MVP preview" tone="muted" />
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
              <PetIdleAnimation size={52} />
            </View>
            <Text style={styles.previewTitle}>{activePet.name}</Text>
            <Text style={styles.previewBody}>
              Lv {activePet.level} {activePet.type} / {activePet.mood} / {activePet.growthStage}
            </Text>
          </Pressable>

          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewEyebrow}>Streak</Text>
              <GameIcon name="flame" size={44} tone="gold" />
            </View>
            <Text style={styles.previewTitle}>{streakSummary.currentStreak} days</Text>
            <Text style={styles.previewBody}>
              Longest streak: {streakSummary.longestStreak} days
              {streakSummary.lastCompletedDate ? ` / Last: ${streakSummary.lastCompletedDate}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today Quests</Text>
          <GameBadge
            label={
              totalQuestCount === 0
                ? 'Generated from habits'
                : allQuestsDone
                  ? 'Cleared'
                  : `${completedQuestCount}/${totalQuestCount} complete`
            }
            tone={allQuestsDone ? 'accent' : 'gold'}
          />
        </View>
        {dailyQuests.length === 0 ? (
          <EmptyState
            actionLabel="Create Habit"
            body="Add one active habit to start generating daily quests."
            title="Quest board is empty"
            visual={<GameIcon name="scroll" size={76} tone="dark" />}
            onAction={() => router.push('/habits')}
          />
        ) : (
          <View style={styles.questList}>
            {dailyQuests.map((quest, index) => (
              <Animated.View
                entering={FadeInDown.delay(index * 45).duration(250)}
                key={quest.id}
                style={[styles.questCard, quest.status === 'completed' ? styles.questCardDone : null]}
              >
                <View style={styles.questCopy}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questReward}>
                    +{quest.xpReward} XP / +{quest.coinReward} coins
                  </Text>
                </View>
                {quest.status === 'completed' ? (
                  <View style={[styles.questStatus, styles.questStatusCompleted]}>
                    <QuestCompleteBurst size={30} />
                    <Text style={styles.questStatusText}>Done</Text>
                  </View>
                ) : quest.status === 'missed' ? (
                  <View style={[styles.questStatus, styles.questStatusMissed]}>
                    <Text style={styles.questStatusText}>Missed</Text>
                  </View>
                ) : (
                  <Pressable onPress={() => completeQuest(quest.id)} style={styles.completeButton}>
                    <Text style={styles.completeButtonText}>Complete</Text>
                  </Pressable>
                )}
              </Animated.View>
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Adventure Map</Text>
          <GameBadge label="Travel" tone="muted" />
        </View>
        <View style={styles.mapPanel}>
          <View style={styles.mapPath} />
          {navItems.map((item) => (
            <Pressable key={item.route} onPress={() => router.push(item.route)} style={styles.mapNode}>
              <GameIcon
                name={item.icon}
                size={46}
                tone={item.route === '/rewards' && dailyChest.status === 'available' ? 'gold' : 'mint'}
              />
              <View style={styles.mapCopy}>
                <Text style={styles.mapLabel}>{item.label}</Text>
                <Text style={styles.mapMeta}>{item.meta}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => router.push('/rewards')} style={styles.chestPanel}>
          <GameIcon name="chest" size={52} tone={dailyChest.status === 'available' ? 'gold' : 'sky'} />
          <View style={styles.chestCopy}>
            <Text style={styles.chestTitle}>Daily Chest</Text>
            <Text style={styles.chestBody}>
              {dailyChest.status === 'available'
                ? `Ready to claim +${dailyChest.coinReward} coins`
                : dailyChest.status === 'claimed'
                  ? 'Claimed for today'
                  : `${dailyChest.completedQuestCount}/${dailyChest.totalQuestCount} quests cleared`}
            </Text>
          </View>
          <GameBadge
            label={
              dailyChest.status === 'available'
                ? 'Ready'
                : dailyChest.status === 'claimed'
                  ? 'Claimed'
                  : missedQuestCount > 0
                    ? `${missedQuestCount} missed`
                    : 'Locked'
            }
            tone={dailyChest.status === 'available' ? 'gold' : 'muted'}
          />
        </Pressable>
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
    backgroundColor: colors.panelDeep,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  levelText: {
    color: colors.surface,
    fontWeight: '900',
  },
  heroCard: {
    backgroundColor: colors.panelDeep,
    borderColor: colors.accent,
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
    borderRadius: 8,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  avatarInfo: {
    flex: 1,
  },
  className: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '900',
  },
  classCopy: {
    color: colors.goldSoft,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  heroProgress: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  heroChip: {
    backgroundColor: '#17362E',
    borderColor: '#285A4E',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 58,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  heroChipLabel: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroChipValue: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
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
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(20, 33, 29, 0.72)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  levelModal: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.gold,
    borderRadius: 8,
    borderWidth: 2,
    gap: spacing.sm,
    maxWidth: 360,
    padding: spacing.xl,
    width: '100%',
  },
  levelModalEyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  levelModalTitle: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
  },
  levelModalBody: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  levelModalButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 46,
    paddingHorizontal: spacing.lg,
  },
  levelModalButtonText: {
    color: colors.surface,
    fontSize: 15,
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
    backgroundColor: colors.panel,
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
  questCardDone: {
    backgroundColor: '#F4FBF7',
    borderColor: colors.mint,
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
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  questStatusCompleted: {
    backgroundColor: colors.mint,
  },
  questStatusMissed: {
    backgroundColor: colors.emberSoft,
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
  chestPanel: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.gold,
    borderLeftWidth: 5,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  chestCopy: {
    flex: 1,
  },
  chestTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  chestBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  mapPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
    position: 'relative',
  },
  mapPath: {
    backgroundColor: colors.goldSoft,
    height: 6,
    left: spacing.lg,
    opacity: 0.75,
    position: 'absolute',
    right: spacing.lg,
    top: 54,
  },
  mapNode: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '48%',
    flexDirection: 'row',
    flexGrow: 1,
    gap: spacing.sm,
    minHeight: 86,
    padding: spacing.sm,
  },
  mapCopy: {
    flex: 1,
  },
  mapLabel: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  mapMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: 2,
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
    flexDirection: 'row',
    flexGrow: 1,
    gap: spacing.sm,
    justifyContent: 'flex-start',
    minHeight: 88,
    padding: spacing.md,
  },
  navCopy: {
    flex: 1,
  },
  navLabel: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  navMeta: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
