import type { Habit } from '@/data/models/habit';
import type { Player, PlayerClass } from '@/data/models/player';
import type { Quest } from '@/data/models/quest';

export type ClassRewardModifiers = {
  bonusCoins: number;
  bonusXp: number;
  labels: string[];
};

export type ClassSkillInfo = {
  activeEffect: string;
  futureTradeoff: string;
  name: string;
};

const percentBonus = (value: number, rate: number) => Math.ceil(value * rate);

export const classSkillInfo: Record<PlayerClass, ClassSkillInfo> = {
  warrior: {
    activeEffect: '+10% XP from Fitness quests and +10% XP from Hard quests.',
    futureTradeoff: 'Hard quests will be powerful, but missed Hard quests may pressure pet mood.',
    name: 'Power Strike',
  },
  scholar: {
    activeEffect: '+10% coins from Learning quests.',
    futureTradeoff: 'Steady economy growth, but fewer burst rewards from Hard quests.',
    name: 'Insight',
  },
  monk: {
    activeEffect: 'Streak shield foundation. Shield spending arrives with inventory.',
    futureTradeoff: 'More forgiving consistency, but slower burst progression.',
    name: 'Calm Mind',
  },
  creator: {
    activeEffect: '+10% XP from Deep Work quests.',
    futureTradeoff: 'Flow combos will be strong, but missed Deep Work may break the combo.',
    name: 'Flow State',
  },
  explorer: {
    activeEffect: '+5 coins from Daily Chest rewards.',
    futureTradeoff: 'Best with varied quest categories; repeated categories give fewer future bonuses.',
    name: 'Trail Bonus',
  },
};

export function getClassRewardModifiers(
  player: Player,
  quest: Quest,
  habit?: Habit | null,
): ClassRewardModifiers {
  if (!habit) {
    return {
      bonusCoins: 0,
      bonusXp: 0,
      labels: [],
    };
  }

  const labels: string[] = [];
  let bonusCoins = 0;
  let bonusXp = 0;

  if (player.selectedClass === 'warrior') {
    if (habit.category === 'fitness') {
      bonusXp += percentBonus(quest.xpReward, 0.1);
      labels.push('Warrior Fitness XP');
    }

    if (habit.difficulty === 'hard') {
      bonusXp += percentBonus(quest.xpReward, 0.1);
      labels.push('Warrior Hard XP');
    }
  }

  if (player.selectedClass === 'scholar' && habit.category === 'learning') {
    bonusCoins += percentBonus(quest.coinReward, 0.1);
    labels.push('Scholar Learning Coins');
  }

  if (player.selectedClass === 'creator' && habit.category === 'deepWork') {
    bonusXp += percentBonus(quest.xpReward, 0.1);
    labels.push('Creator Deep Work XP');
  }

  return {
    bonusCoins,
    bonusXp,
    labels,
  };
}

export function getDailyChestCoinRewardForClass(baseReward: number, player?: Player | null) {
  if (player?.selectedClass === 'explorer') {
    return baseReward + 5;
  }

  return baseReward;
}
