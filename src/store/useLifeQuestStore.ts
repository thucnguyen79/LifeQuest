import { create } from 'zustand';

import { calculatePetGrowthStage, calculatePetLevel } from '@/core/constants/gameRules';
import { achievementProgressRepository } from '@/data/repositories/achievementProgressRepository';
import { playerRepository } from '@/data/repositories/playerRepository';
import { dailyChestRepository } from '@/data/repositories/dailyChestRepository';
import { dailyAdventureRepository } from '@/data/repositories/dailyAdventureRepository';
import { petRepository } from '@/data/repositories/petRepository';
import { questRepository } from '@/data/repositories/questRepository';
import { shopInventoryRepository } from '@/data/repositories/shopInventoryRepository';
import { streakSummaryRepository } from '@/data/repositories/streakSummaryRepository';
import type { AdventureZoneId, DailyAdventure } from '@/data/models/adventure';
import type { Pet } from '@/data/models/pet';
import {
  addLifetimeCoins,
  defaultAchievementProgress,
  syncAchievementProgress,
} from '@/features/achievements/achievements';
import type {
  AchievementProgressRecord,
  AchievementState,
} from '@/features/achievements/achievements';
import type { ReminderPermissionStatus } from '@/features/notifications/habitReminders';
import { syncHabitReminderNotifications } from '@/features/notifications/habitReminders';
import { createInitialPlayer } from '@/features/player/createInitialPlayer';
import type { Player, PlayerClass } from '@/features/player/types';
import {
  bonusObjectiveMapProgress,
  createDailyAdventure,
  getDefaultAdventureZone,
  syncDailyAdventureProgress,
} from '@/features/adventure/dailyAdventure';
import { bonusObjectiveBossDamage, getDailyBossState } from '@/features/boss/dailyBoss';
import type { DailyBossState } from '@/features/boss/dailyBoss';
import { completeQuest as completeQuestWithRewards } from '@/features/quests/completeQuest';
import { completeBonusObjective as completeBonusObjectiveWithRewards } from '@/features/quests/completeBonusObjective';
import { getTodayDateKey } from '@/features/quests/dateUtils';
import { generateDailyQuests } from '@/features/quests/generateDailyQuests';
import { rerollPendingQuest } from '@/features/quests/rerollQuest';
import { chestRarityLabels, getDailyChestState } from '@/features/rewards/dailyChest';
import type { DailyChestState } from '@/features/rewards/dailyChest';
import {
  addShopItem,
  defaultShopInventory,
  feedPetWithFood,
  getShopItem,
  petFoodBondXp,
  removeShopItem,
} from '@/features/shop/shopItems';
import type { ShopInventory, ShopItemId } from '@/features/shop/shopItems';
import { advanceDailyStreak } from '@/features/streaks/dailyStreak';
import { resetLocalData } from '@/features/settings/resetLocalData';
import type { Quest } from '@/features/quests/types';
import type { StreakSummary } from '@/data/repositories/streakSummaryRepository';

type RewardFeedback = {
  body?: string;
  coinsGained: number;
  id: string;
  newLevel?: number;
  previousLevel?: number;
  title: string;
  type: 'achievement' | 'chest' | 'levelUp' | 'quest' | 'shop';
  xpGained: number;
  leveledUp: boolean;
};

type LifeQuestState = {
  isHydrated: boolean;
  notificationsEnabled: boolean;
  notificationsStatus: ReminderPermissionStatus;
  notificationsMessage: string;
  scheduledReminderCount: number;
  isSchedulingNotifications: boolean;
  soundEnabled: boolean;
  player: Player | null;
  activePet: Pet;
  streakSummary: StreakSummary;
  dailyAdventure: DailyAdventure;
  dailyBoss: DailyBossState;
  dailyChest: DailyChestState;
  shopInventory: ShopInventory;
  achievementProgress: AchievementProgressRecord;
  achievements: AchievementState[];
  rewardFeedback: RewardFeedback | null;
  draftPlayerName: string;
  dailyQuests: Quest[];
  hydrateFromLocal: () => void;
  generateTodayQuests: () => void;
  completeQuest: (questId: string) => void;
  completeBonusObjective: (questId: string) => void;
  selectDailyAdventureZone: (zoneId: AdventureZoneId) => void;
  claimDailyChest: () => void;
  purchaseShopItem: (itemId: ShopItemId) => void;
  rerollQuest: (questId: string) => void;
  useShopItem: (itemId: ShopItemId) => void;
  dismissRewardFeedback: () => void;
  setDraftPlayerName: (name: string) => void;
  createPlayer: (name: string, selectedClass: PlayerClass) => Player;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  rescheduleNotifications: () => Promise<void>;
  toggleSound: () => void;
  resetAppData: () => Promise<void>;
};

const initialPet: Pet = {
  id: 'pet-starter',
  name: 'Mochi',
  type: 'dragon',
  level: 1,
  xp: 0,
  mood: 'neutral',
  growthStage: 'baby',
};

function createDailyChestState(
  quests: Quest[] = [],
  date = getTodayDateKey(),
  player?: Player | null,
  boss?: DailyBossState,
  streakSummary = streakSummaryRepository.get(),
) {
  return getDailyChestState(
    date,
    quests,
    dailyChestRepository.get(),
    player,
    boss,
    streakSummary.currentStreak,
  );
}

function createInitialDailyAdventureState() {
  return createDailyAdventure(getTodayDateKey(), 'explorerTrail');
}

function createAchievementState(
  record: AchievementProgressRecord,
  player: Player | null,
  pet: Pet,
  streakSummary: StreakSummary,
) {
  const completedLearningQuests = questRepository
    .listAll()
    .filter((quest) => quest.status === 'completed' && quest.category === 'learning').length;

  return syncAchievementProgress(record, {
    completedLearningQuests,
    currentCoins: player?.coins ?? 0,
    longestStreak: streakSummary.longestStreak,
    petLevel: pet.level,
  });
}

function getNewAchievementLabel(result: ReturnType<typeof syncAchievementProgress>) {
  return result.achievements
    .filter((achievement) => result.newlyUnlockedIds.includes(achievement.id))
    .map((achievement) => achievement.title)
    .join(', ');
}

function createDailyAdventureState(
  quests: Quest[] = [],
  date = getTodayDateKey(),
  player?: Player | null,
  zoneId?: AdventureZoneId,
) {
  const savedAdventure = dailyAdventureRepository.getByDate(date);
  const baseAdventure =
    savedAdventure ??
    createDailyAdventure(date, zoneId ?? getDefaultAdventureZone(player), quests);
  const dailyAdventure = syncDailyAdventureProgress(
    zoneId ? { ...baseAdventure, zoneId } : baseAdventure,
    quests,
  );

  dailyAdventureRepository.upsert(dailyAdventure);
  return dailyAdventure;
}

function createDailyBossState(
  quests: Quest[] = [],
  date = getTodayDateKey(),
  adventure = createInitialDailyAdventureState(),
) {
  return getDailyBossState(date, quests, adventure);
}

export const useLifeQuestStore = create<LifeQuestState>((set, get) => ({
  isHydrated: false,
  notificationsEnabled: false,
  notificationsStatus: 'idle',
  notificationsMessage: 'Daily reminders are off.',
  scheduledReminderCount: 0,
  isSchedulingNotifications: false,
  soundEnabled: true,
  player: null,
  activePet: initialPet,
  streakSummary: {
    currentStreak: 0,
    longestStreak: 0,
  },
  dailyAdventure: createInitialDailyAdventureState(),
  dailyBoss: createDailyBossState(),
  dailyChest: createDailyChestState(),
  shopInventory: defaultShopInventory,
  achievementProgress: defaultAchievementProgress,
  achievements: syncAchievementProgress(defaultAchievementProgress, {
    completedLearningQuests: 0,
    currentCoins: 0,
    longestStreak: 0,
    petLevel: initialPet.level,
  }).achievements,
  rewardFeedback: null,
  draftPlayerName: '',
  dailyQuests: [],
  hydrateFromLocal: () => {
    const player = playerRepository.getCurrent();
    const activePet = petRepository.getActive() ?? initialPet;
    const shopInventory = shopInventoryRepository.get();
    const achievementProgress = achievementProgressRepository.get();
    const streakSummary = streakSummaryRepository.get();
    const dailyQuests = generateDailyQuests();
    const dailyAdventure = createDailyAdventureState(dailyQuests, getTodayDateKey(), player);
    const dailyBoss = createDailyBossState(dailyQuests, getTodayDateKey(), dailyAdventure);
    const achievementResult = createAchievementState(
      achievementProgress,
      player,
      activePet,
      streakSummary,
    );

    achievementProgressRepository.upsert(achievementResult.record);

    set({
      activePet,
      achievementProgress: achievementResult.record,
      achievements: achievementResult.achievements,
      dailyAdventure,
      dailyBoss,
      dailyChest: createDailyChestState(dailyQuests, getTodayDateKey(), player, dailyBoss),
      dailyQuests,
      isHydrated: true,
      player,
      shopInventory,
      streakSummary,
    });
  },
  generateTodayQuests: () => {
    const dailyQuests = generateDailyQuests();
    set((state) => {
      const dailyAdventure = createDailyAdventureState(dailyQuests, getTodayDateKey(), state.player);
      const dailyBoss = createDailyBossState(dailyQuests, getTodayDateKey(), dailyAdventure);

      return {
        dailyAdventure,
        dailyBoss,
        dailyChest: createDailyChestState(dailyQuests, getTodayDateKey(), state.player, dailyBoss),
        dailyQuests,
      };
    });
  },
  completeQuest: (questId: string) => {
    set((state) => {
      if (!state.player) {
        return state;
      }

      const result = completeQuestWithRewards(state.player, questId);

      if (!result) {
        return state;
      }

      if (!result.completed) {
        const dailyQuests = generateDailyQuests();
        const dailyAdventure = createDailyAdventureState(
          dailyQuests,
          getTodayDateKey(),
          state.player,
        );
        const dailyBoss = createDailyBossState(dailyQuests, getTodayDateKey(), dailyAdventure);

        return {
          dailyAdventure,
          dailyBoss,
          dailyChest: createDailyChestState(dailyQuests, getTodayDateKey(), state.player, dailyBoss),
          dailyQuests,
        };
      }

      const streakResult = advanceDailyStreak(
        state.streakSummary,
        result.quest.date,
        state.shopInventory.streakFreeze > 0,
        state.player.selectedClass === 'monk' ? 2 : 1,
      );
      const nextPetXp = state.activePet.xp + result.xpGained;
      const nextPet: Pet = {
        ...state.activePet,
        level: calculatePetLevel(nextPetXp),
        xp: nextPetXp,
        mood: 'happy',
        growthStage: calculatePetGrowthStage(nextPetXp),
      };
      const nextStreakSummary = streakResult.summary;
      const nextInventory = streakResult.usedStreakFreeze
        ? removeShopItem(state.shopInventory, 'streakFreeze')
        : state.shopInventory;
      const dailyQuests = generateDailyQuests();
      const dailyAdventure = createDailyAdventureState(dailyQuests, getTodayDateKey(), result.player);
      const dailyBoss = createDailyBossState(dailyQuests, getTodayDateKey(), dailyAdventure);
      const achievementProgress = addLifetimeCoins(
        state.achievementProgress,
        result.coinsGained,
      );
      const achievementResult = createAchievementState(
        achievementProgress,
        result.player,
        nextPet,
        nextStreakSummary,
      );
      const newAchievementLabel = getNewAchievementLabel(achievementResult);
      const rewardNotes = [
        streakResult.usedStreakFreeze
          ? 'Streak Freeze protected your streak across the missed day gap.'
          : '',
        newAchievementLabel ? `Achievement unlocked: ${newAchievementLabel}.` : '',
      ]
        .filter(Boolean)
        .join(' ');

      petRepository.upsert(nextPet);
      streakSummaryRepository.upsert(nextStreakSummary);
      achievementProgressRepository.upsert(achievementResult.record);
      if (streakResult.usedStreakFreeze) {
        shopInventoryRepository.upsert(nextInventory);
      }

      return {
        player: result.player,
        achievementProgress: achievementResult.record,
        achievements: achievementResult.achievements,
        dailyAdventure,
        dailyBoss,
        dailyChest: createDailyChestState(
          dailyQuests,
          getTodayDateKey(),
          result.player,
          dailyBoss,
          nextStreakSummary,
        ),
        dailyQuests,
        streakSummary: nextStreakSummary,
        shopInventory: nextInventory,
        activePet: nextPet,
        rewardFeedback: {
          id: `${result.quest.id}-${result.quest.completedAt}`,
          coinsGained: result.coinsGained,
          body: rewardNotes || undefined,
          title: result.leveledUp
            ? 'Level Up'
            : newAchievementLabel
              ? 'Achievement Unlocked'
              : streakResult.usedStreakFreeze
                ? 'Streak Protected'
                : result.classBonusLabels.length > 0
                  ? 'Class Bonus'
                  : 'Quest Complete',
          type: result.leveledUp ? 'levelUp' : newAchievementLabel ? 'achievement' : 'quest',
          newLevel: result.newLevel,
          previousLevel: result.previousLevel,
          xpGained: result.xpGained,
          leveledUp: result.leveledUp,
        },
      };
    });
  },
  completeBonusObjective: (questId: string) => {
    set((state) => {
      if (!state.player) {
        return state;
      }

      const result = completeBonusObjectiveWithRewards(state.player, questId);

      if (!result) {
        return state;
      }

      const dailyQuests = generateDailyQuests();
      const dailyAdventure = createDailyAdventureState(
        dailyQuests,
        getTodayDateKey(),
        result.player,
      );
      const dailyBoss = createDailyBossState(dailyQuests, getTodayDateKey(), dailyAdventure);
      const achievementProgress = addLifetimeCoins(
        state.achievementProgress,
        result.coinsGained,
      );
      const achievementResult = createAchievementState(
        achievementProgress,
        result.player,
        state.activePet,
        state.streakSummary,
      );
      const newAchievementLabel = getNewAchievementLabel(achievementResult);

      achievementProgressRepository.upsert(achievementResult.record);

      return {
        achievementProgress: achievementResult.record,
        achievements: achievementResult.achievements,
        dailyAdventure,
        dailyBoss,
        dailyChest: createDailyChestState(
          dailyQuests,
          getTodayDateKey(),
          result.player,
          dailyBoss,
        ),
        dailyQuests,
        player: result.player,
        rewardFeedback: {
          body: `+${bonusObjectiveMapProgress} map progress / +${bonusObjectiveBossDamage} boss damage.${newAchievementLabel ? ` Achievement unlocked: ${newAchievementLabel}.` : ''}`,
          coinsGained: result.coinsGained,
          id: `bonus-${result.quest.id}-${Date.now()}`,
          leveledUp: result.leveledUp,
          newLevel: result.newLevel,
          previousLevel: result.previousLevel,
          title: result.leveledUp ? 'Level Up' : 'Bonus Objective Complete',
          type: result.leveledUp ? 'levelUp' : 'quest',
          xpGained: result.xpGained,
        },
      };
    });
  },
  selectDailyAdventureZone: (zoneId: AdventureZoneId) => {
    set((state) => {
      const dailyAdventure = createDailyAdventureState(
        state.dailyQuests,
        getTodayDateKey(),
        state.player,
        zoneId,
      );
      const dailyBoss = createDailyBossState(state.dailyQuests, getTodayDateKey(), dailyAdventure);

      return {
        dailyAdventure,
        dailyBoss,
        dailyChest: createDailyChestState(
          state.dailyQuests,
          getTodayDateKey(),
          state.player,
          dailyBoss,
        ),
      };
    });
  },
  claimDailyChest: () => {
    set((state) => {
      if (!state.player || state.dailyChest.status !== 'available') {
        return state;
      }

      dailyChestRepository.claim(state.dailyChest.date);

      const nextPlayer = {
        ...state.player,
        coins: state.player.coins + state.dailyChest.coinReward,
        updatedAt: new Date().toISOString(),
      };
      const dailyChest = createDailyChestState(
        state.dailyQuests,
        state.dailyChest.date,
        nextPlayer,
        state.dailyBoss,
      );
      const achievementProgress = addLifetimeCoins(
        state.achievementProgress,
        state.dailyChest.coinReward,
      );
      const achievementResult = createAchievementState(
        achievementProgress,
        nextPlayer,
        state.activePet,
        state.streakSummary,
      );
      const newAchievementLabel = getNewAchievementLabel(achievementResult);

      playerRepository.upsert(nextPlayer);
      achievementProgressRepository.upsert(achievementResult.record);

      return {
        achievementProgress: achievementResult.record,
        achievements: achievementResult.achievements,
        dailyChest,
        player: nextPlayer,
        rewardFeedback: {
          coinsGained: state.dailyChest.coinReward,
          id: `daily-chest-${state.dailyChest.date}`,
          leveledUp: false,
          body: `${chestRarityLabels[state.dailyChest.tier]} reward: +${state.dailyChest.coinReward} coins.${newAchievementLabel ? ` Achievement unlocked: ${newAchievementLabel}.` : ''}`,
          title: `${chestRarityLabels[state.dailyChest.tier]} Chest Claimed`,
          type: 'chest',
          xpGained: 0,
        },
      };
    });
  },
  purchaseShopItem: (itemId: ShopItemId) => {
    set((state) => {
      if (!state.player) {
        return state;
      }

      const item = getShopItem(itemId);

      if (!item || state.player.coins < item.cost) {
        return state;
      }

      const nextInventory = addShopItem(state.shopInventory, itemId);
      const nextPlayer = {
        ...state.player,
        coins: state.player.coins - item.cost,
        updatedAt: new Date().toISOString(),
      };

      playerRepository.upsert(nextPlayer);
      shopInventoryRepository.upsert(nextInventory);

      return {
        player: nextPlayer,
        shopInventory: nextInventory,
        rewardFeedback: {
          body: `${item.name} added to inventory.`,
          coinsGained: -item.cost,
          id: `shop-buy-${item.id}-${Date.now()}`,
          leveledUp: false,
          title: 'Item Purchased',
          type: 'shop',
          xpGained: 0,
        },
      };
    });
  },
  rerollQuest: (questId: string) => {
    set((state) => {
      if (state.shopInventory.questReroll <= 0) {
        return state;
      }

      const currentQuest = questRepository.getById(questId);

      if (!currentQuest) {
        return state;
      }

      const result = rerollPendingQuest(currentQuest);

      if (!result.rerolled) {
        return state;
      }

      const nextInventory = removeShopItem(state.shopInventory, 'questReroll');
      questRepository.upsert(result.quest);
      shopInventoryRepository.upsert(nextInventory);

      const dailyQuests = generateDailyQuests();
      const dailyAdventure = createDailyAdventureState(dailyQuests, getTodayDateKey(), state.player);
      const dailyBoss = createDailyBossState(dailyQuests, getTodayDateKey(), dailyAdventure);

      return {
        dailyAdventure,
        dailyBoss,
        dailyChest: createDailyChestState(dailyQuests, getTodayDateKey(), state.player, dailyBoss),
        dailyQuests,
        shopInventory: nextInventory,
        rewardFeedback: {
          body: `${result.quest.title} now has a lighter daily target.`,
          coinsGained: 0,
          id: `shop-use-questReroll-${Date.now()}`,
          leveledUp: false,
          title: 'Quest Rerolled',
          type: 'shop',
          xpGained: 0,
        },
      };
    });
  },
  useShopItem: (itemId: ShopItemId) => {
    set((state) => {
      if (state.shopInventory[itemId] <= 0) {
        return state;
      }

      const item = getShopItem(itemId);

      if (!item?.usable || itemId !== 'petFood') {
        return state;
      }

      const nextInventory = removeShopItem(state.shopInventory, itemId);
      const nextPet = feedPetWithFood(state.activePet);
      const achievementResult = createAchievementState(
        state.achievementProgress,
        state.player,
        nextPet,
        state.streakSummary,
      );
      const newAchievementLabel = getNewAchievementLabel(achievementResult);

      petRepository.upsert(nextPet);
      shopInventoryRepository.upsert(nextInventory);
      achievementProgressRepository.upsert(achievementResult.record);

      return {
        activePet: nextPet,
        achievementProgress: achievementResult.record,
        achievements: achievementResult.achievements,
        shopInventory: nextInventory,
        rewardFeedback: {
          body: `${nextPet.name} gained +${petFoodBondXp} bond XP.${newAchievementLabel ? ` Achievement unlocked: ${newAchievementLabel}.` : ''}`,
          coinsGained: 0,
          id: `shop-use-${item.id}-${Date.now()}`,
          leveledUp: false,
          title: 'Pet Fed',
          type: 'shop',
          xpGained: petFoodBondXp,
        },
      };
    });
  },
  dismissRewardFeedback: () => set({ rewardFeedback: null }),
  setDraftPlayerName: (name: string) => set({ draftPlayerName: name }),
  createPlayer: (name: string, selectedClass: PlayerClass) => {
    const player = createInitialPlayer(name, selectedClass);
    playerRepository.upsert(player);
    petRepository.upsert(initialPet);
    dailyChestRepository.reset();
    dailyAdventureRepository.reset();
    shopInventoryRepository.reset();
    achievementProgressRepository.reset();
    streakSummaryRepository.upsert({
      currentStreak: 0,
      longestStreak: 0,
    });
    const dailyAdventure = createDailyAdventureState([], getTodayDateKey(), player);
    const dailyBoss = createDailyBossState([], getTodayDateKey(), dailyAdventure);
    const achievementResult = createAchievementState(
      defaultAchievementProgress,
      player,
      initialPet,
      { currentStreak: 0, longestStreak: 0 },
    );

    set({
      activePet: initialPet,
      achievementProgress: achievementResult.record,
      achievements: achievementResult.achievements,
      dailyAdventure,
      dailyBoss,
      dailyChest: createDailyChestState([], getTodayDateKey(), player, dailyBoss),
      draftPlayerName: '',
      player,
      shopInventory: defaultShopInventory,
      streakSummary: {
        currentStreak: 0,
        longestStreak: 0,
      },
    });
    return player;
  },
  setNotificationsEnabled: async (enabled: boolean) => {
    set({ isSchedulingNotifications: true, notificationsEnabled: enabled });
    const result = await syncHabitReminderNotifications(enabled);
    set({
      isSchedulingNotifications: false,
      notificationsEnabled: result.enabled,
      notificationsStatus: result.status,
      notificationsMessage: result.message,
      scheduledReminderCount: result.scheduledCount,
    });
  },
  rescheduleNotifications: async () => {
    const enabled = get().notificationsEnabled;

    if (!enabled) {
      return;
    }

    set({ isSchedulingNotifications: true });

    const result = await syncHabitReminderNotifications(enabled);

    set({
      isSchedulingNotifications: false,
      notificationsEnabled: result.enabled,
      notificationsStatus: result.status,
      notificationsMessage: result.message,
      scheduledReminderCount: result.scheduledCount,
    });
  },
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  resetAppData: async () => {
    await syncHabitReminderNotifications(false);
    resetLocalData();
    achievementProgressRepository.reset();
    set({
      isHydrated: true,
      notificationsEnabled: false,
      notificationsStatus: 'idle',
      notificationsMessage: 'Daily reminders are off.',
      scheduledReminderCount: 0,
      isSchedulingNotifications: false,
      soundEnabled: true,
      player: null,
      activePet: initialPet,
      achievementProgress: defaultAchievementProgress,
      achievements: syncAchievementProgress(defaultAchievementProgress, {
        completedLearningQuests: 0,
        currentCoins: 0,
        longestStreak: 0,
        petLevel: initialPet.level,
      }).achievements,
      dailyAdventure: createInitialDailyAdventureState(),
      dailyBoss: createDailyBossState(),
      dailyChest: createDailyChestState(),
      shopInventory: defaultShopInventory,
      streakSummary: {
        currentStreak: 0,
        longestStreak: 0,
      },
      rewardFeedback: null,
      draftPlayerName: '',
      dailyQuests: [],
    });
  },
}));
