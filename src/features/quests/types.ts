export type QuestStatus = 'pending' | 'completed' | 'missed';

export type Quest = {
  id: string;
  habitId: string;
  title: string;
  xpReward: number;
  coinReward: number;
  status: QuestStatus;
};
