import { create } from 'zustand';

import { calculatePetGrowthStage, calculatePetLevel } from '@/core/constants/gameRules';
import { playerRepository } from '@/data/repositories/playerRepository';
import { petRepository } from '@/data/repositories/petRepository';
import { streakSummaryRepository } from '@/data/repositories/streakSummaryRepository';
import type { Pet } from '@/data/models/pet';
import type { ReminderPermissionStatus } from '@/features/notifications/habitReminders';
import { syncHabitReminderNotifications } from '@/features/notifications/habitReminders';
import { createInitialPlayer } from '@/features/player/createInitialPlayer';
import type { Player, PlayerClass } from '@/features/player/types';
import { completeQuest as completeQuestWithRewards } from '@/features/quests/completeQuest';
import { generateDailyQuests } from '@/features/quests/generateDailyQuests';
import { resetLocalData } from '@/features/settings/resetLocalData';
import type { Quest } from '@/features/quests/types';

type StreakSummary = {
  currentStreak: number;
  longestStreak: number;
};

type RewardFeedback = {
  id: string;
  xpGained: number;
  coinsGained: number;
  previousLevel: number;
  newLevel: number;
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
  rewardFeedback: RewardFeedback | null;
  draftPlayerName: string;
  dailyQuests: Quest[];
  hydrateFromLocal: () => void;
  generateTodayQuests: () => void;
  completeQuest: (questId: string) => void;
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
  rewardFeedback: null,
  draftPlayerName: '',
  dailyQuests: [],
  hydrateFromLocal: () => {
    const player = playerRepository.getCurrent();
    const activePet = petRepository.getActive() ?? initialPet;
    const streakSummary = streakSummaryRepository.get();

    set({ activePet, isHydrated: true, player, streakSummary });
  },
  generateTodayQuests: () => {
    set({ dailyQuests: generateDailyQuests() });
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

      const nextCurrentStreak = state.streakSummary.currentStreak + 1;
      const nextPetXp = state.activePet.xp + result.quest.xpReward;
      const nextPet: Pet = {
        ...state.activePet,
        level: calculatePetLevel(nextPetXp),
        xp: nextPetXp,
        mood: 'happy',
        growthStage: calculatePetGrowthStage(nextPetXp),
      };
      const nextStreakSummary = {
        currentStreak: nextCurrentStreak,
        longestStreak: Math.max(state.streakSummary.longestStreak, nextCurrentStreak),
      };

      petRepository.upsert(nextPet);
      streakSummaryRepository.upsert(nextStreakSummary);

      return {
        player: result.player,
        dailyQuests: generateDailyQuests(),
        streakSummary: nextStreakSummary,
        activePet: nextPet,
        rewardFeedback: {
          id: `${result.quest.id}-${result.quest.completedAt}`,
          xpGained: result.quest.xpReward,
          coinsGained: result.quest.coinReward,
          previousLevel: result.previousLevel,
          newLevel: result.newLevel,
          leveledUp: result.leveledUp,
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
    streakSummaryRepository.upsert({
      currentStreak: 0,
      longestStreak: 0,
    });
    set({
      activePet: initialPet,
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
