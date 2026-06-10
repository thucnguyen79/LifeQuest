import { Redirect, router } from 'expo-router';
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
        </Animated.View>

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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today Quests</Text>
          <Text style={styles.sectionMeta}>Generated later</Text>
        </View>
        <View style={styles.questList}>
          {dailyQuests.map((quest) => (
            <View key={quest.id} style={styles.questCard}>
              <View style={styles.questCopy}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questReward}>
                  +{quest.xpReward} XP / +{quest.coinReward} coins
                </Text>
              </View>
              <View style={styles.questStatus}>
                <Text style={styles.questStatusText}>Pending</Text>
              </View>
            </View>
          ))}
        </View>

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
  questStatusText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '800',
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
