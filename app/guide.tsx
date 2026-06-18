import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/core/components/AppScreen';
import { GameBadge } from '@/core/components/GameBadge';
import { GameIcon } from '@/core/components/GameIcon';
import type { GameIconName } from '@/core/components/GameIcon';
import { GamePanel } from '@/core/components/GamePanel';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import type { PlayerClass } from '@/data/models/player';
import { classSkillInfo } from '@/features/classes/classSkills';

type ClassGuide = {
  bestFor: string;
  currentBonus: string;
  icon: GameIconName;
  name: string;
  passive: string;
  risk: string;
};

type GuideCard = {
  body: string;
  icon: GameIconName;
  title: string;
};

const classGuides: Record<PlayerClass, ClassGuide> = {
  warrior: {
    bestFor: 'Fitness, health routines, hard physical actions.',
    currentBonus: '+2 Strength at character creation.',
    icon: 'classWarrior',
    name: 'Warrior',
    passive: classSkillInfo.warrior.activeEffect,
    risk: classSkillInfo.warrior.futureTradeoff,
  },
  scholar: {
    bestFor: 'Reading, study, courses, research, and knowledge habits.',
    currentBonus: '+2 Intelligence at character creation.',
    icon: 'classScholar',
    name: 'Scholar',
    passive: classSkillInfo.scholar.activeEffect,
    risk: classSkillInfo.scholar.futureTradeoff,
  },
  monk: {
    bestFor: 'Meditation, reflection, journaling, calm routines.',
    currentBonus: '+2 Wisdom at character creation.',
    icon: 'classMonk',
    name: 'Monk',
    passive: classSkillInfo.monk.activeEffect,
    risk: classSkillInfo.monk.futureTradeoff,
  },
  creator: {
    bestFor: 'Deep work, writing, design, coding, and project building.',
    currentBonus: '+2 Focus at character creation.',
    icon: 'classCreator',
    name: 'Creator',
    passive: classSkillInfo.creator.activeEffect,
    risk: classSkillInfo.creator.futureTradeoff,
  },
  explorer: {
    bestFor: 'Social habits, new experiences, outdoor actions, connection.',
    currentBonus: '+2 Charisma at character creation.',
    icon: 'classExplorer',
    name: 'Explorer',
    passive: classSkillInfo.explorer.activeEffect,
    risk: classSkillInfo.explorer.futureTradeoff,
  },
};

const currentLoop: GuideCard[] = [
  {
    body: 'Create real-life habits. Active habits become daily quests based on their schedule.',
    icon: 'habit',
    title: 'Build Quest Sources',
  },
  {
    body: 'Complete today\'s quests to gain XP, coins, stat growth, streak progress, and pet bond XP.',
    icon: 'spark',
    title: 'Clear Daily Quests',
  },
  {
    body: 'Choose a daily zone. Quest progress clears map nodes and unlocks the next reward layer.',
    icon: 'compass',
    title: 'Advance The Map',
  },
  {
    body: 'Clear the route to open the boss gate. Quest progress damages the daily boss.',
    icon: 'flame',
    title: 'Defeat Daily Boss',
  },
  {
    body: 'Clear quests to unlock the chest. Defeat the boss first to upgrade it into a Boss Chest.',
    icon: 'chest',
    title: 'Claim Rewards',
  },
  {
    body: 'Spend coins on Pet Food, Streak Freeze, and Quest Reroll inventory. Pet Food can feed Mochi now.',
    icon: 'coin',
    title: 'Use Reward Shop',
  },
  {
    body: 'Mochi grows through bond XP. Feed Pet Food from Companion or finish quests to keep care moving.',
    icon: 'petDragon',
    title: 'Grow Your Companion',
  },
];

const comingSystems: GuideCard[] = [
  {
    body: 'Each class gains passive advantages and later skill points from level-ups.',
    icon: 'shield',
    title: 'Class Skills',
  },
  {
    body: 'Chests will roll Common, Rare, or Epic rewards. Streaks and class bonuses improve odds.',
    icon: 'chest',
    title: 'Chest Rarity',
  },
  {
    body: 'Milestones such as 7-day streaks, pet level 5, and 10 Learning quests will unlock badges.',
    icon: 'book',
    title: 'Achievements',
  },
];

export default function GuideScreen() {
  return (
    <AppScreen backTo="/dashboard" canGoBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>LifeQuest Codex</Text>
          <Text style={styles.title}>How to play</Text>
          <Text style={styles.body}>
            Turn daily habits into quests, character growth, pet bond, and rewards.
          </Text>
        </View>

        <GamePanel tone="dark" style={styles.heroPanel}>
          <GameIcon name="scroll" size={70} tone="gold" />
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Core Loop</Text>
            <Text style={styles.heroBody}>
              Pick a class, create habit sources, finish today's quests, claim rewards, and
              return tomorrow stronger.
            </Text>
          </View>
        </GamePanel>

        <SectionTitle badge="MVP" title="Today's Gameplay" />
        <View style={styles.grid}>
          {currentLoop.map((item) => (
            <GuideInfoCard key={item.title} item={item} />
          ))}
        </View>

        <SectionTitle badge="Classes" title="Character Paths" />
        <View style={styles.classList}>
          {Object.entries(classGuides).map(([key, item]) => (
            <ClassCard key={key} item={item} />
          ))}
        </View>

        <SectionTitle badge="Next" title="Coming Gameplay Pass" />
        <View style={styles.grid}>
          {comingSystems.map((item) => (
            <GuideInfoCard key={item.title} item={item} muted />
          ))}
        </View>

        <GamePanel tone="parchment" style={styles.tipPanel}>
          <Text style={styles.tipTitle}>Early Strategy</Text>
          <Text style={styles.tipBody}>
            Start with 2-3 daily habits. Mix one easy quest with one medium or hard quest so XP
            feels meaningful without making the day brittle.
          </Text>
          <Pressable onPress={() => router.replace('/habits')} style={styles.actionButton}>
            <Text style={styles.actionText}>Create Quest Sources</Text>
          </Pressable>
        </GamePanel>
      </ScrollView>
    </AppScreen>
  );
}

function SectionTitle({ badge, title }: { badge: string; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <GameBadge label={badge} tone="muted" />
    </View>
  );
}

function GuideInfoCard({ item, muted = false }: { item: GuideCard; muted?: boolean }) {
  return (
    <GamePanel tone={muted ? 'parchment' : 'surface'} style={styles.infoCard}>
      <GameIcon name={item.icon} size={44} tone={muted ? 'sky' : 'mint'} />
      <Text style={styles.infoTitle}>{item.title}</Text>
      <Text style={styles.infoBody}>{item.body}</Text>
    </GamePanel>
  );
}

function ClassCard({ item }: { item: ClassGuide }) {
  return (
    <GamePanel accent tone="surface" style={styles.classCard}>
      <GameIcon name={item.icon} size={66} tone="gold" />
      <View style={styles.classCopy}>
        <View style={styles.classHeader}>
          <Text style={styles.className}>{item.name}</Text>
          <GameBadge label="Path" tone="gold" />
        </View>
        <Text style={styles.classBody}>{item.bestFor}</Text>
        <Text style={styles.classCurrent}>{item.currentBonus}</Text>
        <Text style={styles.classPassive}>{item.passive}</Text>
        <Text style={styles.classRisk}>{item.risk}</Text>
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  actionText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '900',
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  classBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  classCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  classCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  classCurrent: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '900',
  },
  classHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  classList: {
    gap: spacing.md,
  },
  className: {
    color: colors.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
  },
  classPassive: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  classRisk: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  header: {
    gap: spacing.xs,
  },
  heroBody: {
    color: colors.goldSoft,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  heroCopy: {
    flex: 1,
  },
  heroPanel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '900',
  },
  infoBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  infoCard: {
    flexBasis: '48%',
    flexGrow: 1,
    gap: spacing.sm,
    minHeight: 162,
  },
  infoTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  tipBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  tipPanel: {
    gap: spacing.xs,
  },
  tipTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '900',
  },
});
