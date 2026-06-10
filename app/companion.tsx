import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppScreen } from '@/core/components/AppScreen';
import { ProgressBar } from '@/core/components/ProgressBar';
import {
  calculatePetCurrentXp,
  petXpPerLevel,
} from '@/core/constants/gameRules';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import type { PetGrowthStage, PetMood, PetType } from '@/data/models/pet';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

const petTypeConfig: Record<PetType, { label: string; trait: string }> = {
  dragon: {
    label: 'Dragon',
    trait: 'Brave and steady under pressure.',
  },
  fox: {
    label: 'Fox',
    trait: 'Quick, curious, and adaptable.',
  },
  cat: {
    label: 'Cat',
    trait: 'Calm, focused, and independent.',
  },
  owl: {
    label: 'Owl',
    trait: 'Patient, observant, and wise.',
  },
};

const moodCopy: Record<PetMood, { label: string; body: string }> = {
  happy: {
    label: 'Happy',
    body: 'Quest progress is keeping your companion energized.',
  },
  neutral: {
    label: 'Neutral',
    body: 'Complete a quest to lift your companion mood.',
  },
  sad: {
    label: 'Sad',
    body: 'Missed momentum will be handled in a later streak task.',
  },
};

const growthCopy: Record<PetGrowthStage, { label: string; next: string }> = {
  egg: {
    label: 'Egg',
    next: 'Hatch at the first growth milestone.',
  },
  baby: {
    label: 'Baby',
    next: 'Young at 160 bond XP.',
  },
  young: {
    label: 'Young',
    next: 'Adult at 400 bond XP.',
  },
  adult: {
    label: 'Adult',
    next: 'Max MVP growth stage reached.',
  },
};

export default function CompanionScreen() {
  const player = useLifeQuestStore((state) => state.player);
  const activePet = useLifeQuestStore((state) => state.activePet);
  const streakSummary = useLifeQuestStore((state) => state.streakSummary);
  const dailyQuests = useLifeQuestStore((state) => state.dailyQuests);

  if (!player) {
    return <Redirect href="/" />;
  }

  const petType = petTypeConfig[activePet.type];
  const petMood = moodCopy[activePet.mood];
  const petGrowth = growthCopy[activePet.growthStage];
  const currentBondXp = calculatePetCurrentXp(activePet.xp);
  const completedQuestCount = dailyQuests.filter((quest) => quest.status === 'completed').length;

  return (
    <AppScreen canGoBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Companion</Text>
          <Text style={styles.title}>{activePet.name}</Text>
          <Text style={styles.body}>{petType.trait}</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(320)} style={styles.heroCard}>
          <PetAvatar type={activePet.type} />
          <View style={styles.heroCopy}>
            <Text style={styles.petName}>{petType.label}</Text>
            <Text style={styles.petMeta}>
              Lv {activePet.level} / {petGrowth.label} / {petMood.label}
            </Text>
            <View style={styles.bondBadge}>
              <Text style={styles.bondBadgeText}>{activePet.xp} bond XP</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.progressCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bond XP</Text>
            <Text style={styles.sectionMeta}>{activePet.xp} total</Text>
          </View>
          <ProgressBar
            current={currentBondXp}
            label={`${currentBondXp} / ${petXpPerLevel} XP to next level`}
            max={petXpPerLevel}
          />
        </View>

        <View style={styles.grid}>
          <StatusCard accent="gold" label="Mood" title={petMood.label} body={petMood.body} />
          <StatusCard accent="mint" label="Growth" title={petGrowth.label} body={petGrowth.next} />
          <StatusCard
            accent="sky"
            label="Streak"
            title={`${streakSummary.currentStreak} days`}
            body={`Best streak: ${streakSummary.longestStreak} days`}
          />
          <StatusCard
            accent="ember"
            label="Today"
            title={`${completedQuestCount} quests`}
            body="Completed quests feed bond XP."
          />
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Growth Path</Text>
          <View style={styles.timelineList}>
            <GrowthStep active={activePet.growthStage === 'baby'} label="Baby" meta="0 XP" />
            <GrowthStep active={activePet.growthStage === 'young'} label="Young" meta="160 XP" />
            <GrowthStep active={activePet.growthStage === 'adult'} label="Adult" meta="400 XP" />
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

type StatusCardProps = {
  accent: 'ember' | 'gold' | 'mint' | 'sky';
  label: string;
  title: string;
  body: string;
};

function StatusCard({ accent, label, title, body }: StatusCardProps) {
  return (
    <View style={styles.statusCard}>
      <View style={[styles.statusAccent, styles[`${accent}Accent`]]} />
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={styles.statusTitle}>{title}</Text>
      <Text style={styles.statusBody}>{body}</Text>
    </View>
  );
}

type PetAvatarProps = {
  type: PetType;
};

function PetAvatar({ type }: PetAvatarProps) {
  return (
    <View style={styles.petVisual}>
      <View style={styles.petAura} />
      <View style={styles.petWingLeft} />
      <View style={styles.petWingRight} />
      <View style={styles.petBody}>
        <View style={styles.petHornLeft} />
        <View style={styles.petHornRight} />
        <View style={styles.petFace}>
          <View style={styles.petEye} />
          <View style={styles.petEye} />
        </View>
        <View style={styles.petMouth} />
      </View>
      <Text style={styles.petTypeMark}>{type.slice(0, 2).toUpperCase()}</Text>
    </View>
  );
}

type GrowthStepProps = {
  active: boolean;
  label: string;
  meta: string;
};

function GrowthStep({ active, label, meta }: GrowthStepProps) {
  return (
    <View style={[styles.growthStep, active ? styles.growthStepActive : null]}>
      <View style={[styles.growthDot, active ? styles.growthDotActive : null]} />
      <View style={styles.growthCopy}>
        <Text style={styles.growthLabel}>{label}</Text>
        <Text style={styles.growthMeta}>{meta}</Text>
      </View>
    </View>
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
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.panelDeep,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.lg,
  },
  petVisual: {
    alignItems: 'center',
    backgroundColor: '#17362E',
    borderRadius: 8,
    height: 136,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    width: 136,
  },
  petAura: {
    backgroundColor: colors.goldSoft,
    borderRadius: 80,
    height: 104,
    opacity: 0.25,
    position: 'absolute',
    width: 104,
  },
  petWingLeft: {
    backgroundColor: colors.sky,
    borderRadius: 8,
    height: 42,
    left: 18,
    opacity: 0.9,
    position: 'absolute',
    top: 48,
    transform: [{ rotate: '-22deg' }],
    width: 42,
  },
  petWingRight: {
    backgroundColor: colors.sky,
    borderRadius: 8,
    height: 42,
    opacity: 0.9,
    position: 'absolute',
    right: 18,
    top: 48,
    transform: [{ rotate: '22deg' }],
    width: 42,
  },
  petBody: {
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderColor: colors.surface,
    borderRadius: 28,
    borderWidth: 3,
    height: 78,
    justifyContent: 'center',
    position: 'relative',
    width: 78,
  },
  petHornLeft: {
    backgroundColor: colors.gold,
    borderRadius: 6,
    height: 20,
    left: 14,
    position: 'absolute',
    top: -12,
    transform: [{ rotate: '-20deg' }],
    width: 12,
  },
  petHornRight: {
    backgroundColor: colors.gold,
    borderRadius: 6,
    height: 20,
    position: 'absolute',
    right: 14,
    top: -12,
    transform: [{ rotate: '20deg' }],
    width: 12,
  },
  petFace: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  petEye: {
    backgroundColor: colors.ink,
    borderRadius: 6,
    height: 10,
    width: 10,
  },
  petMouth: {
    backgroundColor: colors.ember,
    borderRadius: 8,
    height: 6,
    marginTop: spacing.sm,
    width: 24,
  },
  petTypeMark: {
    bottom: spacing.sm,
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '900',
    position: 'absolute',
    right: spacing.sm,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  petName: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '900',
  },
  petMeta: {
    color: colors.goldSoft,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  bondBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gold,
    borderRadius: 8,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  bondBadgeText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
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
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusCard: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    gap: spacing.xs,
    minHeight: 132,
    padding: spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  statusAccent: {
    height: 5,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  emberAccent: {
    backgroundColor: colors.ember,
  },
  goldAccent: {
    backgroundColor: colors.gold,
  },
  mintAccent: {
    backgroundColor: colors.accent,
  },
  skyAccent: {
    backgroundColor: colors.sky,
  },
  statusLabel: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  statusBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  timelineList: {
    gap: spacing.sm,
  },
  growthStep: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  growthStepActive: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
  },
  growthDot: {
    backgroundColor: colors.border,
    borderRadius: 8,
    height: 16,
    width: 16,
  },
  growthDotActive: {
    backgroundColor: colors.gold,
  },
  growthCopy: {
    flex: 1,
  },
  growthLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  growthMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
});
