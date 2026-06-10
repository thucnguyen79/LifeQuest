import { create } from 'zustand';

import { playerRepository } from '@/data/repositories/playerRepository';
import type { Pet } from '@/data/models/pet';
import { createInitialPlayer } from '@/features/player/createInitialPlayer';
import type { Player, PlayerClass } from '@/features/player/types';
import { generateDailyQuests } from '@/features/quests/generateDailyQuests';
import type { Quest } from '@/features/quests/types';

type StreakSummary = {
  currentStreak: number;
  longestStreak: number;
};

type LifeQuestState = {
  isHydrated: boolean;
  notificationsEnabled: boolean;
  player: Player | null;
  activePet: Pet;
  streakSummary: StreakSummary;
  draftPlayerName: string;
  dailyQuests: Quest[];
  hydrateFromLocal: () => void;
  generateTodayQuests: () => void;
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
  draftPlayerName: '',
  dailyQuests: [],
  hydrateFromLocal: () => {
    const player = playerRepository.getCurrent();
    set({ isHydrated: true, player });
  },
  generateTodayQuests: () => {
    set({ dailyQuests: generateDailyQuests() });
  },
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
