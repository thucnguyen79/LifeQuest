import { create } from 'zustand';

import { calculatePetGrowthStage, calculatePetLevel } from '@/core/constants/gameRules';
import { playerRepository } from '@/data/repositories/playerRepository';
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
    set({ isHydrated: true, player });
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

      return {
        player: result.player,
        dailyQuests: generateDailyQuests(),
        streakSummary: {
          currentStreak: nextCurrentStreak,
          longestStreak: Math.max(state.streakSummary.longestStreak, nextCurrentStreak),
        },
        activePet: {
          ...state.activePet,
          level: calculatePetLevel(nextPetXp),
          xp: nextPetXp,
          mood: 'happy',
          growthStage: calculatePetGrowthStage(nextPetXp),
        },
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
    set({ draftPlayerName: '', player });
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
