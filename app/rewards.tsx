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
import {
  chestRewardRanges,
  chestRarityLabels,
  epicChestStreakRequirement,
  rareChestStreakRequirement,
  type ChestRarity,
} from '@/features/rewards/dailyChest';
import { rewardShopItems } from '@/features/shop/shopItems';
import { useLifeQuestStore } from '@/store/useLifeQuestStore';

const rewardTracks = [
  {
    icon: 'chest',
    title: 'Daily Chest',
    status: 'Live',
    body: 'Clear every quest today to unlock the chest. Boss victories and streaks raise its rarity.',
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

const rarityRules: Array<{
  body: string;
  reward: string;
  tier: ChestRarity;
  title: string;
}> = [
  {
    body: 'Clear every quest today.',
    reward: `${chestRewardRanges.common.min}-${chestRewardRanges.common.max} coins`,
    tier: 'common',
    title: 'Common',
  },
  {
    body: `Defeat the boss or reach a ${rareChestStreakRequirement}-day streak.`,
    reward: `${chestRewardRanges.rare.min}-${chestRewardRanges.rare.max} coins`,
    tier: 'rare',
    title: 'Rare',
  },
  {
    body: `Defeat the boss with a ${epicChestStreakRequirement}-day streak.`,
    reward: `${chestRewardRanges.epic.min}-${chestRewardRanges.epic.max} coins`,
    tier: 'epic',
    title: 'Epic',
  },
];

const rarityBadgeTone: Record<ChestRarity, 'accent' | 'danger' | 'gold'> = {
  common: 'accent',
  epic: 'danger',
  rare: 'gold',
};

const rarityIconTone: Record<ChestRarity, 'dark' | 'gold' | 'sky'> = {
  common: 'sky',
  epic: 'dark',
  rare: 'gold',
};

export default function RewardsScreen() {
  const player = useLifeQuestStore((state) => state.player);
  const dailyChest = useLifeQuestStore((state) => state.dailyChest);
  const shopInventory = useLifeQuestStore((state) => state.shopInventory);
  const claimDailyChest = useLifeQuestStore((state) => state.claimDailyChest);
  const purchaseShopItem = useLifeQuestStore((state) => state.purchaseShopItem);
  const useShopItem = useLifeQuestStore((state) => state.useShopItem);

  if (!player) {
    return <Redirect href="/" />;
  }

  return (
    <AppScreen backTo="/dashboard" canGoBack>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Rewards</Text>
          <Text style={styles.title}>Vault</Text>
          <Text style={styles.body}>Claim bounded loot rolls and spend coins on adventure tools.</Text>
        </View>

        <Animated.View entering={FadeInDown.duration(300)} style={styles.coinCard}>
          <View>
            <Text style={styles.coinLabel}>Current Balance</Text>
            <Text style={styles.coinValue}>{player.coins}</Text>
          </View>
          <GameIcon name="chest" size={92} tone="gold" />
        </Animated.View>

        <GamePanel accent tone="parchment" style={styles.claimCard}>
          <View style={styles.claimHeader}>
            <GameIcon
              name="chest"
              size={64}
              tone={rarityIconTone[dailyChest.tier]}
            />
            <View style={styles.claimCopy}>
              <Text style={styles.claimTitle}>{chestRarityLabels[dailyChest.tier]} Chest</Text>
              <Text style={styles.claimBody}>
                {dailyChest.status === 'available'
                  ? `Guaranteed roll: +${dailyChest.coinReward} coins.`
                  : dailyChest.status === 'claimed'
                    ? 'Claimed for today. Come back after tomorrow quests.'
                    : `Clear ${dailyChest.totalQuestCount - dailyChest.completedQuestCount} more quest(s) today.`}
              </Text>
            </View>
            <GameBadge
              label={dailyChest.tier}
              tone={rarityBadgeTone[dailyChest.tier]}
            />
          </View>
          <View style={styles.chestDetails}>
            <View style={styles.chestDetailRow}>
              <Text style={styles.chestDetailLabel}>Tier roll</Text>
              <Text style={styles.chestDetailValue}>
                {dailyChest.rewardMin}-{dailyChest.rewardMax} coins
              </Text>
            </View>
            <View style={styles.chestDetailRow}>
              <Text style={styles.chestDetailLabel}>Tier source</Text>
              <Text style={styles.chestDetailValue}>{dailyChest.rarityReason}</Text>
            </View>
            {dailyChest.classBonusCoins > 0 ? (
              <View style={styles.chestDetailRow}>
                <Text style={styles.chestDetailLabel}>Class bonus</Text>
                <Text style={styles.chestDetailValue}>
                  +{dailyChest.classBonusCoins} Explorer coins
                </Text>
              </View>
            ) : null}
            <Text style={styles.chestNextHint}>{dailyChest.nextTierHint}</Text>
          </View>
          <Pressable
            disabled={dailyChest.status !== 'available'}
            onPress={claimDailyChest}
            style={[
              styles.claimButton,
              dailyChest.status !== 'available' ? styles.claimButtonDisabled : null,
            ]}
          >
            <Text
              style={[
                styles.claimButtonText,
                dailyChest.status !== 'available' ? styles.claimButtonTextDisabled : null,
              ]}
            >
              {dailyChest.status === 'claimed' ? 'Claimed' : 'Claim Chest'}
            </Text>
          </Pressable>
        </GamePanel>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chest Rarity</Text>
          <GameBadge label="Bounded rolls" tone="accent" />
        </View>
        <GamePanel tone="parchment" style={styles.rarityPanel}>
          {rarityRules.map((rule) => {
            const isCurrent = dailyChest.tier === rule.tier;

            return (
              <View
                key={rule.tier}
                style={[styles.rarityRow, isCurrent ? styles.rarityRowCurrent : null]}
              >
                <GameIcon name="chest" size={42} tone={rarityIconTone[rule.tier]} />
                <View style={styles.rarityCopy}>
                  <View style={styles.rarityTitleRow}>
                    <Text style={styles.rarityTitle}>{rule.title}</Text>
                    {isCurrent ? (
                      <GameBadge label="Current" tone={rarityBadgeTone[rule.tier]} />
                    ) : null}
                  </View>
                  <Text style={styles.rarityBody}>{rule.body}</Text>
                </View>
                <Text style={styles.rarityReward}>{rule.reward}</Text>
              </View>
            );
          })}
        </GamePanel>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reward Shop</Text>
          <GameBadge label="Coins matter" tone="gold" />
        </View>
        <View style={styles.shopGrid}>
          {rewardShopItems.map((item, index) => {
            const ownedCount = shopInventory[item.id];
            const canBuy = player.coins >= item.cost;
            const canUse = item.usable && ownedCount > 0;

            return (
              <Animated.View
                entering={FadeInDown.delay(index * 55).duration(260)}
                key={item.id}
                style={styles.shopCard}
              >
                <View style={styles.shopTopRow}>
                  <GameIcon name={item.icon} size={50} tone={item.usable ? 'mint' : 'sky'} />
                  <View style={styles.shopCopy}>
                    <Text style={styles.shopTitle}>{item.name}</Text>
                    <Text style={styles.shopBody}>{item.body}</Text>
                  </View>
                  <GameBadge label={`${ownedCount} owned`} tone={ownedCount > 0 ? 'gold' : 'muted'} />
                </View>
                <Text style={styles.shopEffect}>{item.effectLabel}</Text>
                <View style={styles.shopActions}>
                  <Pressable
                    disabled={!canBuy}
                    onPress={() => purchaseShopItem(item.id)}
                    style={[styles.shopButton, !canBuy ? styles.shopButtonDisabled : null]}
                  >
                    <Text
                      style={[
                        styles.shopButtonText,
                        !canBuy ? styles.shopButtonTextDisabled : null,
                      ]}
                    >
                      Buy {item.cost}
                    </Text>
                  </Pressable>
                  <Pressable
                    disabled={!canUse}
                    onPress={() => useShopItem(item.id)}
                    style={[
                      styles.shopButtonSecondary,
                      !canUse ? styles.shopButtonDisabled : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.shopButtonSecondaryText,
                        !canUse ? styles.shopButtonTextDisabled : null,
                      ]}
                    >
                      {item.actionLabel}
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>
            );
          })}
        </View>

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
  claimCard: {
    gap: spacing.md,
  },
  claimHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  claimCopy: {
    flex: 1,
  },
  claimTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  claimBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  chestDetails: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.sm,
  },
  chestDetailRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  chestDetailLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  chestDetailValue: {
    color: colors.ink,
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'right',
  },
  chestNextHint: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
    marginTop: spacing.xs,
  },
  claimButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 46,
  },
  claimButtonDisabled: {
    backgroundColor: colors.border,
  },
  claimButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
  claimButtonTextDisabled: {
    color: colors.muted,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  rarityPanel: {
    gap: spacing.sm,
  },
  rarityRow: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 76,
    padding: spacing.sm,
  },
  rarityRowCurrent: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
  },
  rarityCopy: {
    flex: 1,
    minWidth: 0,
  },
  rarityTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  rarityTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  rarityBody: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  rarityReward: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    maxWidth: 64,
    textAlign: 'right',
  },
  shopGrid: {
    gap: spacing.md,
  },
  shopCard: {
    backgroundColor: colors.panel,
    borderColor: colors.gold,
    borderLeftWidth: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  shopTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  shopCopy: {
    flex: 1,
    minWidth: 0,
  },
  shopTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  shopBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  shopEffect: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 17,
  },
  shopActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  shopButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  shopButtonSecondary: {
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  shopButtonDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  shopButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '900',
  },
  shopButtonSecondaryText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  shopButtonTextDisabled: {
    color: colors.muted,
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
