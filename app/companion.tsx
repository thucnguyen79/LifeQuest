import { Redirect } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppScreen } from '@/core/components/AppScreen';
import { PetIdleAnimation } from '@/core/components/GameAnimation';
import { GameBadge } from '@/core/components/GameBadge';
import { GameIcon } from '@/core/components/GameIcon';
import type { GameIconName } from '@/core/components/GameIcon';
import { ProgressBar } from '@/core/components/ProgressBar';
import {
  calculatePetCurrentXp,
  petXpPerLevel,
} from '@/core/constants/gameRules';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { getPetCareState } from '@/features/pets/petCare';
import { petFoodBondXp } from '@/features/shop/shopItems';
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
  const shopInventory = useLifeQuestStore((state) => state.shopInventory);
  const streakSummary = useLifeQuestStore((state) => state.streakSummary);
  const dailyQuests = useLifeQuestStore((state) => state.dailyQuests);
  const useShopItem = useLifeQuestStore((state) => state.useShopItem);

  if (!player) {
    return <Redirect href="/" />;
  }

  const petType = petTypeConfig[activePet.type];
  const petMood = moodCopy[activePet.mood];
  const petGrowth = growthCopy[activePet.growthStage];
  const currentBondXp = calculatePetCurrentXp(activePet.xp);
  const completedQuestCount = dailyQuests.filter((quest) => quest.status === 'completed').length;
  const pendingQuestCount = dailyQuests.filter((quest) => quest.status === 'pending').length;
  const petFoodCount = shopInventory.petFood;
  const careState = getPetCareState(activePet, petFoodCount, pendingQuestCount);

  return (
    <AppScreen backTo="/dashboard" canGoBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Companion</Text>
          <Text style={styles.title}>{activePet.name}</Text>
          <Text style={styles.body}>{petType.trait}</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(320)} style={styles.heroCard}>
          <PetAvatarMark type={activePet.type} />
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

        <Animated.View entering={FadeInDown.delay(80).duration(280)} style={styles.careCard}>
          <View style={styles.careHeader}>
            <GameIcon name="petDragon" size={58} tone="mint" />
            <View style={styles.careCopy}>
              <View style={styles.careTitleRow}>
                <Text style={styles.careTitle}>Pet Care</Text>
                <GameBadge label={careState.label} tone={careState.tone} />
              </View>
              <Text style={styles.careBody}>{careState.body}</Text>
            </View>
          </View>
          <View style={styles.inventoryRow}>
            <View style={styles.inventoryPill}>
              <Text style={styles.inventoryLabel}>Pet Food</Text>
              <Text style={styles.inventoryValue}>{petFoodCount}</Text>
            </View>
            <View style={styles.inventoryPill}>
              <Text style={styles.inventoryLabel}>Feed Effect</Text>
              <Text style={styles.inventoryValue}>+{petFoodBondXp} XP</Text>
            </View>
          </View>
          <Pressable
            disabled={petFoodCount <= 0}
            onPress={() => useShopItem('petFood')}
            style={[styles.feedButton, petFoodCount <= 0 ? styles.feedButtonDisabled : null]}
          >
            <Text
              style={[
                styles.feedButtonText,
                petFoodCount <= 0 ? styles.feedButtonTextDisabled : null,
              ]}
            >
              {petFoodCount > 0 ? 'Feed Mochi' : 'Buy Pet Food in Rewards'}
            </Text>
          </Pressable>
        </Animated.View>

        <View style={styles.grid}>
          <StatusCard
            accent="gold"
            body={petMood.body}
            icon="spark"
            label="Mood"
            title={petMood.label}
          />
          <StatusCard
            accent="mint"
            body={petGrowth.next}
            icon="shield"
            label="Growth"
            title={petGrowth.label}
          />
          <StatusCard
            accent="sky"
            icon="flame"
            label="Streak"
            title={`${streakSummary.currentStreak} days`}
            body={`Best streak: ${streakSummary.longestStreak} days`}
          />
          <StatusCard
            accent="ember"
            icon="scroll"
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
  icon: GameIconName;
  label: string;
  title: string;
  body: string;
};

function StatusCard({ accent, body, icon, label, title }: StatusCardProps) {
  return (
    <View style={styles.statusCard}>
      <View style={[styles.statusAccent, styles[`${accent}Accent`]]} />
      <View style={styles.statusHeader}>
        <Text style={styles.statusLabel}>{label}</Text>
        <GameIcon name={icon} size={30} tone={accent === 'sky' ? 'sky' : accent === 'mint' ? 'mint' : 'gold'} />
      </View>
      <Text style={styles.statusTitle}>{title}</Text>
      <Text style={styles.statusBody}>{body}</Text>
    </View>
  );
}

type PetAvatarProps = {
  type: PetType;
};

function PetAvatarMark({ type }: PetAvatarProps) {
  return (
    <View style={styles.petVisual}>
      <PetIdleAnimation size={132} />
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
  careCard: {
    backgroundColor: colors.panel,
    borderColor: colors.gold,
    borderLeftWidth: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  careHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  careCopy: {
    flex: 1,
    minWidth: 0,
  },
  careTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  careTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  careBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  inventoryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inventoryPill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 58,
    padding: spacing.sm,
  },
  inventoryLabel: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  inventoryValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  feedButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 46,
  },
  feedButtonDisabled: {
    backgroundColor: colors.border,
  },
  feedButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
  feedButtonTextDisabled: {
    color: colors.muted,
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
  statusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
