import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppScreen } from '@/core/components/AppScreen';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

const rewardTracks = [
  {
    title: 'Daily Chest',
    status: 'Preview',
    body: 'Coins from quests will open lightweight daily reward moments after MVP polish.',
  },
  {
    title: 'Badge Rack',
    status: 'Locked',
    body: 'Streak and level badges will appear here after test coverage is in place.',
  },
  {
    title: 'Cosmetic Shop',
    status: 'Later',
    body: 'Pet cosmetics and avatar themes stay out of scope until progression feels stable.',
  },
];

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
          <View style={styles.coinMark}>
            <Text style={styles.coinMarkText}>$</Text>
          </View>
        </Animated.View>

        <View style={styles.trackList}>
          {rewardTracks.map((track, index) => (
            <Animated.View
              entering={FadeInDown.delay(index * 60).duration(280)}
              key={track.title}
              style={styles.trackCard}
            >
              <View style={styles.trackTopRow}>
                <Text style={styles.trackTitle}>{track.title}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{track.status}</Text>
                </View>
              </View>
              <Text style={styles.trackBody}>{track.body}</Text>
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
    backgroundColor: colors.ink,
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
  coinMark: {
    alignItems: 'center',
    backgroundColor: colors.gold,
    borderRadius: 8,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  coinMarkText: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
  },
  trackList: {
    gap: spacing.md,
  },
  trackCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
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
  statusBadge: {
    backgroundColor: colors.goldSoft,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
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
