export type QuestStatus = 'pending' | 'completed' | 'missed';

export type Quest = {
  id: string;
  habitId: string;
  title: string;
  date: string;
  xpReward: number;
  coinReward: number;
  status: QuestStatus;
  completedAt?: string;
};
