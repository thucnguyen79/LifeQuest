export type QuestStatus = 'pending' | 'completed' | 'missed';

export type QuestEnergy = 'light' | 'medium' | 'heavy';

export type QuestPriority = 'low' | 'normal' | 'high';

export type Quest = {
  id: string;
  habitId: string;
  title: string;
  date: string;
  xpReward: number;
  coinReward: number;
  targetCount: number;
  progressCount: number;
  priority: QuestPriority;
  energy: QuestEnergy;
  estimatedMinutes?: number;
  bonusObjective?: string;
  bonusCompleted?: boolean;
  status: QuestStatus;
  completedAt?: string;
};
