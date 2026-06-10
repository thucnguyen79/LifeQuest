import { create } from 'zustand';

import { playerRepository } from '@/data/repositories';
import { createInitialPlayer } from '@/features/player/createInitialPlayer';
import type { Player, PlayerClass } from '@/features/player/types';
import type { Quest } from '@/features/quests/types';

type LifeQuestState = {
  isHydrated: boolean;
  notificationsEnabled: boolean;
  player: Player | null;
  draftPlayerName: string;
  dailyQuests: Quest[];
  hydrateFromLocal: () => void;
  setDraftPlayerName: (name: string) => void;
  createPlayer: (name: string, selectedClass: PlayerClass) => Player;
  toggleNotifications: () => void;
};

const initialQuests: Quest[] = [
  {
    id: 'quest-read',
    habitId: 'habit-reading',
    title: 'Read for 20 minutes',
    date: new Date().toISOString().slice(0, 10),
    xpReward: 20,
    coinReward: 6,
    status: 'pending',
  },
  {
    id: 'quest-focus',
    habitId: 'habit-focus',
    title: 'Complete one deep work session',
    date: new Date().toISOString().slice(0, 10),
    xpReward: 35,
    coinReward: 10,
    status: 'pending',
  },
];

export const useLifeQuestStore = create<LifeQuestState>((set) => ({
  isHydrated: false,
  notificationsEnabled: false,
  player: null,
  draftPlayerName: '',
  dailyQuests: initialQuests,
  hydrateFromLocal: () => {
    const player = playerRepository.getCurrent();
    set({ isHydrated: true, player });
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
