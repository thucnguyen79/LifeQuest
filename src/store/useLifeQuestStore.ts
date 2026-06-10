import { create } from 'zustand';

import type { Player } from '@/features/player/types';
import type { Quest } from '@/features/quests/types';

type LifeQuestState = {
  onboardingComplete: boolean;
  notificationsEnabled: boolean;
  player: Player;
  dailyQuests: Quest[];
  completeOnboarding: () => void;
  toggleNotifications: () => void;
};

const initialPlayer: Player = {
  id: 'local-player',
  name: 'Adventurer',
  selectedClass: 'scholar',
  level: 1,
  currentXp: 0,
  totalXp: 0,
  coins: 0,
  strength: 1,
  intelligence: 3,
  focus: 2,
  wisdom: 1,
  charisma: 1,
  discipline: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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
  onboardingComplete: false,
  notificationsEnabled: false,
  player: initialPlayer,
  dailyQuests: initialQuests,
  completeOnboarding: () => set({ onboardingComplete: true }),
  toggleNotifications: () =>
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
}));
