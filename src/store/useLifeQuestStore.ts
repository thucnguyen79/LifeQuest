import { create } from 'zustand';

import { calculatePetGrowthStage, calculatePetLevel } from '@/core/constants/gameRules';
import { playerRepository } from '@/data/repositories/playerRepository';
import type { Pet } from '@/data/models/pet';
import { createInitialPlayer } from '@/features/player/createInitialPlayer';
import type { Player, PlayerClass } from '@/features/player/types';
import { completeQuest as completeQuestWithRewards } from '@/features/quests/completeQuest';
import { generateDailyQuests } from '@/features/quests/generateDailyQuests';
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
  toggleNotifications: () => void;
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

export const useLifeQuestStore = create<LifeQuestState>((set) => ({
  isHydrated: false,
  notificationsEnabled: false,
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
  toggleNotifications: () =>
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
}));
