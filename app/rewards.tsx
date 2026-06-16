import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppScreen } from '@/core/components/AppScreen';
import { GameBadge } from '@/core/components/GameBadge';
import { GameIcon } from '@/core/components/GameIcon';
import type { GameIconName } from '@/core/components/GameIcon';
import { GamePanel } from '@/core/components/GamePanel';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

const rewardTracks = [
  {
    icon: 'chest',
    title: 'Daily Chest',
    status: 'Preview',
    body: 'Coins from quests will open lightweight daily reward moments after MVP polish.',
  },
  {
    icon: 'shield',
    title: 'Badge Rack',
    status: 'Locked',
    body: 'Streak and level badges will appear here after test coverage is in place.',
  },
  {
    icon: 'spark',
    title: 'Cosmetic Shop',
    status: 'Later',
    body: 'Pet cosmetics and avatar themes stay out of scope until progression feels stable.',
  },
] satisfies Array<{
  body: string;
  icon: GameIconName;
  status: string;
  title: string;
}>;

export default function RewardsScreen() {
  const player = useLifeQuestStore((state) => state.player);

  if (!player) {
    return <Redirect href="/" />;
  }

  return (
    <AppScreen canGoBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Rewards</Text>
          <Text style={styles.title}>Vault</Text>
          <Text style={styles.body}>Quest coins and future badges collect here.</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(300)} style={styles.coinCard}>
          <View>
            <Text style={styles.coinLabel}>Current Balance</Text>
            <Text style={styles.coinValue}>{player.coins}</Text>
          </View>
          <GameIcon name="chest" size={92} tone="gold" />
        </Animated.View>

        <View style={styles.trackList}>
          {rewardTracks.map((track, index) => (
            <Animated.View
              entering={FadeInDown.delay(index * 60).duration(280)}
              key={track.title}
            >
              <GamePanel tone="parchment" style={styles.trackCard}>
                <View style={styles.trackTopRow}>
                  <GameIcon name={track.icon} size={44} tone={index === 0 ? 'gold' : 'sky'} />
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <GameBadge
                    label={track.status}
                    tone={track.status === 'Locked' ? 'muted' : 'gold'}
                  />
                </View>
                <Text style={styles.trackBody}>{track.body}</Text>
                <View style={styles.slotRow}>
                  <View style={styles.rewardSlot}>
                    <GameIcon name="coin" size={28} tone="gold" />
                  </View>
                  <View style={styles.rewardSlot}>
                    <GameIcon name="flame" size={28} tone="sky" />
                  </View>
                  <View style={styles.rewardSlot}>
                    <GameIcon name="petDragon" size={28} tone="mint" />
                  </View>
                </View>
              </GamePanel>
            </Animated.View>
          ))}
        </View>

        <Pressable onPress={() => router.replace('/dashboard')} style={styles.dashboardButton}>
          <Text style={styles.dashboardButtonText}>Return to Dashboard</Text>
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
    gap: spacing.xs,
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
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  coinCard: {
    alignItems: 'center',
    backgroundColor: colors.panelDeep,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  coinLabel: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  coinValue: {
    color: colors.surface,
    fontSize: 42,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  chest: {
    alignItems: 'center',
    backgroundColor: colors.ember,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.gold,
    height: 76,
    justifyContent: 'center',
    position: 'relative',
    width: 92,
  },
  chestLid: {
    backgroundColor: colors.gold,
    borderRadius: 8,
    height: 24,
    left: -6,
    position: 'absolute',
    right: -6,
    top: -14,
  },
  chestLock: {
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  chestLockText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  trackList: {
    gap: spacing.md,
  },
  trackCard: {
    gap: spacing.sm,
  },
  trackTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  trackTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
  },
  trackBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  slotRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  rewardSlot: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    flex: 1,
    height: 42,
    justifyContent: 'center',
  },
  dashboardButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  dashboardButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
});
