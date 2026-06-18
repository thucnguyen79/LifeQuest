import { create } from 'zustand';

import { calculatePetGrowthStage, calculatePetLevel } from '@/core/constants/gameRules';
import { playerRepository } from '@/data/repositories/playerRepository';
import { dailyChestRepository } from '@/data/repositories/dailyChestRepository';
import { dailyAdventureRepository } from '@/data/repositories/dailyAdventureRepository';
import { petRepository } from '@/data/repositories/petRepository';
import { streakSummaryRepository } from '@/data/repositories/streakSummaryRepository';
import type { AdventureZoneId, DailyAdventure } from '@/data/models/adventure';
import type { Pet } from '@/data/models/pet';
import type { ReminderPermissionStatus } from '@/features/notifications/habitReminders';
import { syncHabitReminderNotifications } from '@/features/notifications/habitReminders';
import { createInitialPlayer } from '@/features/player/createInitialPlayer';
import type { Player, PlayerClass } from '@/features/player/types';
import {
  createDailyAdventure,
  getDefaultAdventureZone,
  syncDailyAdventureProgress,
} from '@/features/adventure/dailyAdventure';
import { completeQuest as completeQuestWithRewards } from '@/features/quests/completeQuest';
import { getTodayDateKey } from '@/features/quests/dateUtils';
import { generateDailyQuests } from '@/features/quests/generateDailyQuests';
import { getDailyChestState } from '@/features/rewards/dailyChest';
import type { DailyChestState } from '@/features/rewards/dailyChest';
import { advanceDailyStreak } from '@/features/streaks/dailyStreak';
import { resetLocalData } from '@/features/settings/resetLocalData';
import type { Quest } from '@/features/quests/types';
import type { StreakSummary } from '@/data/repositories/streakSummaryRepository';

type RewardFeedback = {
  coinsGained: number;
  id: string;
  newLevel?: number;
  previousLevel?: number;
  title: string;
  type: 'chest' | 'levelUp' | 'quest';
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
  dailyChest: DailyChestState;
  rewardFeedback: RewardFeedback | null;
  draftPlayerName: string;
  dailyQuests: Quest[];
  hydrateFromLocal: () => void;
  generateTodayQuests: () => void;
  completeQuest: (questId: string) => void;
  selectDailyAdventureZone: (zoneId: AdventureZoneId) => void;
  claimDailyChest: () => void;
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
) {
  return getDailyChestState(date, quests, dailyChestRepository.get(), player);
}

function createInitialDailyAdventureState() {
  return createDailyAdventure(getTodayDateKey(), 'explorerTrail');
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
  dailyChest: createDailyChestState(),
  rewardFeedback: null,
  draftPlayerName: '',
  dailyQuests: [],
  hydrateFromLocal: () => {
    const player = playerRepository.getCurrent();
    const activePet = petRepository.getActive() ?? initialPet;
    const streakSummary = streakSummaryRepository.get();
    const dailyQuests = generateDailyQuests();
    const dailyAdventure = createDailyAdventureState(dailyQuests, getTodayDateKey(), player);

    set({
      activePet,
      dailyAdventure,
      dailyChest: createDailyChestState(dailyQuests, getTodayDateKey(), player),
      dailyQuests,
      isHydrated: true,
      player,
      streakSummary,
    });
  },
  generateTodayQuests: () => {
    const dailyQuests = generateDailyQuests();
    set((state) => ({
      dailyAdventure: createDailyAdventureState(dailyQuests, getTodayDateKey(), state.player),
      dailyChest: createDailyChestState(dailyQuests, getTodayDateKey(), state.player),
      dailyQuests,
    }));
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

        return {
          dailyAdventure: createDailyAdventureState(
            dailyQuests,
            getTodayDateKey(),
            state.player,
          ),
          dailyChest: createDailyChestState(dailyQuests, getTodayDateKey(), state.player),
          dailyQuests,
        };
      }

      const streakResult = advanceDailyStreak(state.streakSummary, result.quest.date);
      const nextPetXp = state.activePet.xp + result.xpGained;
      const nextPet: Pet = {
        ...state.activePet,
        level: calculatePetLevel(nextPetXp),
        xp: nextPetXp,
        mood: 'happy',
        growthStage: calculatePetGrowthStage(nextPetXp),
      };
      const nextStreakSummary = streakResult.summary;
      const dailyQuests = generateDailyQuests();

      petRepository.upsert(nextPet);
      streakSummaryRepository.upsert(nextStreakSummary);

      return {
        player: result.player,
        dailyAdventure: createDailyAdventureState(dailyQuests, getTodayDateKey(), result.player),
        dailyChest: createDailyChestState(dailyQuests, getTodayDateKey(), result.player),
        dailyQuests,
        streakSummary: nextStreakSummary,
        activePet: nextPet,
        rewardFeedback: {
          id: `${result.quest.id}-${result.quest.completedAt}`,
          coinsGained: result.coinsGained,
          title: result.leveledUp
            ? 'Level Up'
            : result.classBonusLabels.length > 0
              ? 'Class Bonus'
              : 'Quest Complete',
          type: result.leveledUp ? 'levelUp' : 'quest',
          newLevel: result.newLevel,
          previousLevel: result.previousLevel,
          xpGained: result.xpGained,
          leveledUp: result.leveledUp,
        },
      };
    });
  },
  selectDailyAdventureZone: (zoneId: AdventureZoneId) => {
    set((state) => ({
      dailyAdventure: createDailyAdventureState(
        state.dailyQuests,
        getTodayDateKey(),
        state.player,
        zoneId,
      ),
    }));
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
      );

      playerRepository.upsert(nextPlayer);

      return {
        dailyChest,
        player: nextPlayer,
        rewardFeedback: {
          coinsGained: state.dailyChest.coinReward,
          id: `daily-chest-${state.dailyChest.date}`,
          leveledUp: false,
          title: 'Daily Chest Claimed',
          type: 'chest',
          xpGained: 0,
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
    streakSummaryRepository.upsert({
      currentStreak: 0,
      longestStreak: 0,
    });
    set({
      activePet: initialPet,
      dailyAdventure: createDailyAdventureState([], getTodayDateKey(), player),
      dailyChest: createDailyChestState([], getTodayDateKey(), player),
      draftPlayerName: '',
      player,
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
      dailyAdventure: createInitialDailyAdventureState(),
      dailyChest: createDailyChestState(),
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
