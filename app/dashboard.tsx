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
import { adventureZoneList, getAdventureZone } from '@/core/constants/adventureZones';
import { characterClasses } from '@/core/constants/gameRules';
import { getHabitCategoryLabel } from '@/core/constants/habitOptions';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import type { PlayerClass } from '@/data/models/player';
import {
  bonusObjectiveMapProgress,
  calculateAdventureQuestSummary,
} from '@/features/adventure/dailyAdventure';
import { bonusObjectiveBossDamage } from '@/features/boss/dailyBoss';
import { classSkillInfo } from '@/features/classes/classSkills';
import {
  bonusObjectiveCoinReward,
  bonusObjectiveXpReward,
} from '@/features/quests/completeBonusObjective';
import {
  chestRarityLabels,
  epicChestStreakRequirement,
} from '@/features/rewards/dailyChest';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

const navItems = [
  { label: 'Habits', meta: 'Quest sources', route: '/habits', icon: 'habit' },
  { label: 'Pet', meta: 'Bond growth', route: '/companion', icon: 'petDragon' },
  { label: 'Rewards', meta: 'Coins & badges', route: '/rewards', icon: 'chest' },
  { label: 'Codex', meta: 'How to play', route: '/guide', icon: 'book' },
  { label: 'Settings', meta: 'Preferences', route: '/settings', icon: 'gear' },
] as const;

const classIcons: Record<PlayerClass, GameIconName> = {
  creator: 'classCreator',
  explorer: 'classExplorer',
  monk: 'classMonk',
  scholar: 'classScholar',
  warrior: 'classWarrior',
};

const adventureLayers: Array<{
  icon: GameIconName;
  label: string;
  meta: string;
  threshold: number;
}> = [
  { icon: 'compass', label: 'Scout', meta: 'Find route', threshold: 1 },
  { icon: 'spark', label: 'Trial', meta: 'Clear node', threshold: 2 },
  { icon: 'shield', label: 'Gate', meta: 'Unlock layer', threshold: 3 },
  { icon: 'flame', label: 'Boss', meta: 'Ready next', threshold: 4 },
];

export default function DashboardScreen() {
  const player = useLifeQuestStore((state) => state.player);
  const dailyQuests = useLifeQuestStore((state) => state.dailyQuests);
  const activePet = useLifeQuestStore((state) => state.activePet);
  const streakSummary = useLifeQuestStore((state) => state.streakSummary);
  const dailyChest = useLifeQuestStore((state) => state.dailyChest);
  const dailyAdventure = useLifeQuestStore((state) => state.dailyAdventure);
  const dailyBoss = useLifeQuestStore((state) => state.dailyBoss);
  const shopInventory = useLifeQuestStore((state) => state.shopInventory);
  const rewardFeedback = useLifeQuestStore((state) => state.rewardFeedback);
  const generateTodayQuests = useLifeQuestStore((state) => state.generateTodayQuests);
  const completeQuest = useLifeQuestStore((state) => state.completeQuest);
  const completeBonusObjective = useLifeQuestStore((state) => state.completeBonusObjective);
  const rerollQuest = useLifeQuestStore((state) => state.rerollQuest);
  const selectDailyAdventureZone = useLifeQuestStore((state) => state.selectDailyAdventureZone);
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
  const classSkill = classSkillInfo[player.selectedClass];
  const completedQuestCount = dailyQuests.filter((quest) => quest.status === 'completed').length;
  const missedQuestCount = dailyQuests.filter((quest) => quest.status === 'missed').length;
  const totalQuestCount = dailyQuests.length;
  const allQuestsDone = totalQuestCount > 0 && completedQuestCount === totalQuestCount;
  const showLevelUpModal = rewardFeedback?.type === 'levelUp';
  const activeZone = getAdventureZone(dailyAdventure.zoneId);
  const adventureSummary = calculateAdventureQuestSummary(
    dailyQuests,
    dailyAdventure.nodeTarget,
    dailyAdventure.zoneId,
  );
  const mapNodesRemaining = Math.max(dailyAdventure.nodeTarget - dailyAdventure.nodeProgress, 0);
  const bossBadgeLabel =
    dailyBoss.status === 'defeated'
      ? 'Defeated'
      : dailyBoss.status === 'active'
        ? 'In battle'
        : 'Locked';

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
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Daily Adventure</Text>
            <Text adjustsFontSizeToFit numberOfLines={2} style={styles.title}>
              Welcome, {player.name}
            </Text>
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
              <Text style={styles.classCopy}>Character growth powered by today's quests.</Text>
              <Text style={styles.classPassive}>
                {classSkill.name}: {classSkill.activeEffect}
              </Text>
            </View>
          </View>
          <View style={styles.heroProgress}>
            <ProgressBar current={player.currentXp} label={`${player.currentXp} / 100 XP`} max={100} />
          </View>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipLabel}>Coins</Text>
              <Text adjustsFontSizeToFit numberOfLines={1} style={styles.heroChipValue}>
                {player.coins}
              </Text>
            </View>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipLabel}>Quests</Text>
              <Text adjustsFontSizeToFit numberOfLines={1} style={styles.heroChipValue}>
                {completedQuestCount}/{totalQuestCount}
              </Text>
            </View>
            <View style={styles.heroChip}>
              <Text style={styles.heroChipLabel}>Chest</Text>
              <Text adjustsFontSizeToFit numberOfLines={1} style={styles.heroChipValue}>
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
                {rewardFeedback.body
                  ? rewardFeedback.body
                  : rewardFeedback.xpGained > 0
                  ? `+${rewardFeedback.xpGained} XP earned`
                  : `+${rewardFeedback.coinsGained} coins`}
              </Text>
              {rewardFeedback.type === 'shop' ? null : (
                <Text style={styles.rewardBody}>
                  +{rewardFeedback.xpGained} XP / +{rewardFeedback.coinsGained} coins
                </Text>
              )}
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
            <Text style={styles.inventoryHint}>
              {shopInventory.streakFreeze > 0
                ? `${shopInventory.streakFreeze} freeze ready`
                : 'No streak freeze stored'}
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
                  <Text style={styles.questProgress}>
                    Progress {quest.progressCount ?? 0}/{quest.targetCount ?? 1}
                  </Text>
                  <Text style={styles.questReward}>
                    +{quest.xpReward} XP / +{quest.coinReward} coins
                  </Text>
                  <View style={styles.questMetaRow}>
                    <GameBadge label={getHabitCategoryLabel(quest.category)} tone="gold" />
                    <GameBadge label={quest.priority ?? 'normal'} tone="muted" />
                    <GameBadge label={quest.energy ?? 'medium'} tone="muted" />
                    {quest.estimatedMinutes ? (
                      <GameBadge label={`${quest.estimatedMinutes} min`} tone="muted" />
                    ) : null}
                    {quest.rerolledAt ? <GameBadge label="rerolled" tone="accent" /> : null}
                  </View>
                  {quest.bonusObjective ? (
                    <View style={styles.questBonusPanel}>
                      <View style={styles.questBonusHeader}>
                        <Text style={styles.questBonusLabel}>Bonus Objective</Text>
                        <GameBadge
                          label={
                            quest.bonusCompleted
                              ? 'Claimed'
                              : quest.status === 'missed'
                                ? 'Forfeited'
                                : 'Optional'
                          }
                          tone={quest.bonusCompleted ? 'gold' : 'muted'}
                        />
                      </View>
                      <Text style={styles.questBonus}>{quest.bonusObjective}</Text>
                      <View style={styles.questBonusFooter}>
                        <Text style={styles.questBonusReward}>
                          {`+${bonusObjectiveXpReward} XP / +${bonusObjectiveCoinReward} coins / +${bonusObjectiveMapProgress} map / +${bonusObjectiveBossDamage} boss`}
                        </Text>
                        {!quest.bonusCompleted && quest.status !== 'missed' ? (
                          <Pressable
                            onPress={() => completeBonusObjective(quest.id)}
                            style={styles.bonusButton}
                          >
                            <Text style={styles.bonusButtonText}>Claim Bonus</Text>
                          </Pressable>
                        ) : null}
                      </View>
                    </View>
                  ) : null}
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
                  <View style={styles.questActions}>
                    {shopInventory.questReroll > 0 && !quest.rerolledAt ? (
                      <Pressable onPress={() => rerollQuest(quest.id)} style={styles.rerollButton}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.rerollButtonText}>
                          Reroll ({shopInventory.questReroll})
                        </Text>
                      </Pressable>
                    ) : null}
                    <Pressable onPress={() => completeQuest(quest.id)} style={styles.completeButton}>
                      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.completeButtonText}>
                        {(quest.progressCount ?? 0) + 1 >= (quest.targetCount ?? 1)
                          ? 'Complete'
                          : 'Add Progress'}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </Animated.View>
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Adventure Map</Text>
          <GameBadge label={dailyAdventure.cleared ? 'Route cleared' : 'Daily zone'} tone="gold" />
        </View>
        <View style={styles.zonePanel}>
          <View style={styles.zoneHeader}>
            <GameIcon name={activeZone.icon} size={64} tone={activeZone.tone} />
            <View style={styles.zoneCopy}>
              <Text style={styles.zoneEyebrow}>{activeZone.mapTheme}</Text>
              <Text style={styles.zoneTitle}>{activeZone.name}</Text>
              <Text style={styles.zoneBody}>{activeZone.description}</Text>
              <Text style={styles.zoneEffect}>{activeZone.effectLabel}</Text>
            </View>
          </View>
          <View style={styles.zoneProgressPanel}>
            <ProgressBar
              current={dailyAdventure.nodeProgress}
              label={`${dailyAdventure.nodeProgress}/${dailyAdventure.nodeTarget} map nodes cleared`}
              max={dailyAdventure.nodeTarget}
            />
            <Text style={styles.zoneHint}>
              {dailyAdventure.cleared
                ? `${dailyBoss.name} is waiting at the boss gate.`
                : `${mapNodesRemaining} node${mapNodesRemaining === 1 ? '' : 's'} until the boss gate opens.`}
            </Text>
            <View style={styles.zoneStatRow}>
              <View style={styles.zoneStat}>
                <Text style={styles.zoneStatLabel}>Matched</Text>
                <Text style={styles.zoneStatValue}>{adventureSummary.matchedQuestCount}</Text>
              </View>
              <View style={styles.zoneStat}>
                <Text style={styles.zoneStatLabel}>Base</Text>
                <Text style={styles.zoneStatValue}>{adventureSummary.baseProgress}</Text>
              </View>
              <View style={styles.zoneStat}>
                <Text style={styles.zoneStatLabel}>Bonus</Text>
                <Text style={styles.zoneStatValue}>+{adventureSummary.bonusProgress}</Text>
              </View>
            </View>
          </View>
          <View style={styles.layerGrid}>
            {adventureLayers.map((layer) => {
              const cleared = dailyAdventure.nodeProgress >= layer.threshold;
              const active =
                !dailyAdventure.cleared && adventureSummary.nextNodeIndex === layer.threshold;

              return (
                <View
                  key={layer.label}
                  style={[
                    styles.layerNode,
                    cleared ? styles.layerNodeCleared : null,
                    active ? styles.layerNodeActive : null,
                  ]}
                >
                  <GameIcon
                    name={layer.icon}
                    size={34}
                    tone={cleared ? 'gold' : active ? 'mint' : 'plain'}
                  />
                  <Text style={[styles.layerLabel, cleared ? styles.layerNodeClearedText : null]}>
                    {layer.label}
                  </Text>
                  <Text style={[styles.layerMeta, cleared ? styles.layerNodeClearedText : null]}>
                    {cleared ? 'Cleared' : active ? 'Active' : layer.meta}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.zoneGrid}>
            {adventureZoneList.map((zone) => {
              const selected = zone.id === dailyAdventure.zoneId;

              return (
                <Pressable
                  key={zone.id}
                  onPress={() => selectDailyAdventureZone(zone.id)}
                  style={[styles.zoneChip, selected ? styles.zoneChipSelected : null]}
                >
                  <GameIcon name={zone.icon} size={36} tone={selected ? zone.tone : 'plain'} />
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={[styles.zoneChipText, selected ? styles.zoneChipTextSelected : null]}
                  >
                    {zone.shortName}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Boss</Text>
          <GameBadge
            label={bossBadgeLabel}
            tone={dailyBoss.status === 'defeated' ? 'gold' : dailyBoss.status === 'active' ? 'accent' : 'muted'}
          />
        </View>
        <View
          style={[
            styles.bossPanel,
            dailyBoss.status === 'defeated' ? styles.bossPanelDefeated : null,
          ]}
        >
          <GameIcon
            name={dailyBoss.status === 'defeated' ? 'chest' : 'flame'}
            size={64}
            tone={dailyBoss.status === 'defeated' ? 'gold' : dailyBoss.status === 'active' ? 'mint' : 'plain'}
          />
          <View style={styles.bossCopy}>
            <Text style={styles.bossEyebrow}>{activeZone.shortName} encounter</Text>
            <Text style={styles.bossTitle}>{dailyBoss.name}</Text>
            <Text style={styles.bossBody}>
              {dailyBoss.status === 'locked'
                ? 'Clear the Adventure Map route to open the boss gate.'
                : dailyBoss.status === 'defeated'
                  ? `Defeated. Rare chest unlocked; reach a ${epicChestStreakRequirement}-day streak for Epic.`
                  : 'Quest progress deals damage. Complete every target to finish the fight.'}
            </Text>
            <View style={styles.bossProgress}>
              <ProgressBar
                current={dailyBoss.damage}
                label={
                  dailyBoss.maxHp > 0
                    ? `${dailyBoss.damage}/${dailyBoss.maxHp} damage / ${dailyBoss.currentHp} HP left${dailyBoss.bonusDamage > 0 ? ` / +${dailyBoss.bonusDamage} bonus` : ''}`
                    : 'Create quests to summon a daily boss'
                }
                max={dailyBoss.maxHp}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Travel Routes</Text>
          <GameBadge label="Shortcuts" tone="muted" />
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
            <Text style={styles.chestTitle}>
              {chestRarityLabels[dailyChest.tier]} Chest
            </Text>
            <Text style={styles.chestBody}>
              {dailyChest.status === 'available'
                ? `Ready: +${dailyChest.coinReward} coins from a ${dailyChest.rewardMin}-${dailyChest.rewardMax} roll`
                : dailyChest.status === 'claimed'
                  ? 'Claimed for today'
                  : `${dailyChest.completedQuestCount}/${dailyChest.totalQuestCount} quests cleared / ${dailyChest.rarityReason}`}
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
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
    flexShrink: 0,
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
  classPassive: {
    color: colors.mint,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
    marginTop: spacing.xs,
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
    fontSize: 18,
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
  inventoryHint: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
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
  questProgress: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },
  questMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  questBonus: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  questBonusPanel: {
    backgroundColor: colors.panel,
    borderColor: colors.gold,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  questBonusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  questBonusLabel: {
    color: colors.accent,
    flex: 1,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  questBonusFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  questBonusReward: {
    color: colors.muted,
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    minWidth: 140,
  },
  bonusButton: {
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: spacing.sm,
  },
  bonusButtonText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '900',
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
  questActions: {
    gap: spacing.xs,
    minWidth: 104,
  },
  rerollButton: {
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: spacing.sm,
  },
  rerollButtonText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
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
  bossPanel: {
    alignItems: 'center',
    backgroundColor: colors.panelDeep,
    borderColor: colors.accent,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  bossPanelDefeated: {
    borderColor: colors.gold,
  },
  bossCopy: {
    flex: 1,
    minWidth: 0,
  },
  bossEyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  bossTitle: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  bossBody: {
    color: colors.goldSoft,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  bossProgress: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  zonePanel: {
    backgroundColor: colors.panelDeep,
    borderColor: colors.accent,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  zoneHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  zoneCopy: {
    flex: 1,
    minWidth: 0,
  },
  zoneEyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  zoneTitle: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  zoneBody: {
    color: colors.goldSoft,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  zoneEffect: {
    color: colors.mint,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 17,
    marginTop: spacing.xs,
  },
  zoneProgressPanel: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    gap: spacing.sm,
    padding: spacing.md,
  },
  zoneHint: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  zoneStatRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  zoneStat: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 54,
    padding: spacing.sm,
  },
  zoneStatLabel: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  zoneStatValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  layerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  layerNode: {
    alignItems: 'center',
    backgroundColor: '#17362E',
    borderColor: '#285A4E',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 96,
    minWidth: 96,
    padding: spacing.sm,
  },
  layerNodeActive: {
    borderColor: colors.mint,
  },
  layerNodeCleared: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
  },
  layerLabel: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '900',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  layerMeta: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
  layerNodeClearedText: {
    color: colors.ink,
  },
  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  zoneChip: {
    alignItems: 'center',
    backgroundColor: '#17362E',
    borderColor: '#285A4E',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '30%',
    flexDirection: 'row',
    flexGrow: 1,
    gap: spacing.xs,
    minHeight: 54,
    padding: spacing.sm,
  },
  zoneChipSelected: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
  },
  zoneChipText: {
    color: colors.surface,
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
  },
  zoneChipTextSelected: {
    color: colors.ink,
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
