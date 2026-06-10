import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { AppScreen } from '@/core/components/AppScreen';
import { PrimaryButton } from '@/core/components/PrimaryButton';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

const onboardingPoints = [
  { icon: 'XP', title: 'Real habits become character progress' },
  { icon: 'ST', title: 'Fitness, learning, focus, wisdom, and charisma grow stats' },
  { icon: 'PET', title: 'Streaks keep your companion happy and evolving' },
];

export default function OnboardingScreen() {
  const completeOnboarding = useLifeQuestStore((state) => state.completeOnboarding);

  const start = () => {
    completeOnboarding();
    router.replace('/dashboard');
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        <Animated.View entering={FadeInUp.duration(450)} style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>LQ</Text>
          </View>
          <Text style={styles.title}>LifeQuest</Text>
          <Text style={styles.tagline}>Every habit shapes your character.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(450)} style={styles.points}>
          {onboardingPoints.map((point) => (
            <View key={point.title} style={styles.pointCard}>
              <View style={styles.pointIcon}>
                <Text style={styles.pointIconText}>{point.icon}</Text>
              </View>
              <Text style={styles.pointTitle}>{point.title}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.actions}>
          <PrimaryButton label="Start Adventure" onPress={start} />
          <Pressable onPress={() => router.push('/settings')} style={styles.secondaryAction}>
            <Text style={styles.secondaryText}>Settings</Text>
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  hero: {
    paddingTop: spacing.xl,
  },
  avatar: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.gold,
    borderRadius: 8,
    height: 72,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 72,
  },
  avatarText: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
  },
  title: {
    color: colors.ink,
    fontSize: 44,
    fontWeight: '900',
  },
  tagline: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 26,
    marginTop: spacing.xs,
  },
  points: {
    gap: spacing.md,
  },
  pointCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  pointIcon: {
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pointIconText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  pointTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  secondaryAction: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  secondaryText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
  },
});
