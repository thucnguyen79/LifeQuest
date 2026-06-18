import type { Pet } from '@/data/models/pet';

export type PetCareState = {
  body: string;
  label: 'Happy' | 'Hungry' | 'Resting' | 'Sleepy';
  tone: 'accent' | 'gold' | 'muted';
};

export function getPetCareState(
  pet: Pet,
  petFoodCount: number,
  pendingQuestCount: number,
): PetCareState {
  if (pet.mood === 'happy') {
    return {
      body: 'Mochi feels cared for. Feed again to grow bond faster.',
      label: 'Happy',
      tone: 'gold',
    };
  }

  if (petFoodCount > 0) {
    return {
      body: 'Pet Food is ready. Feed Mochi for bond XP and a happier mood.',
      label: 'Hungry',
      tone: 'accent',
    };
  }

  if (pendingQuestCount > 0) {
    return {
      body: 'Finish a quest or buy Pet Food to wake up pet growth.',
      label: 'Sleepy',
      tone: 'muted',
    };
  }

  return {
    body: 'No pet action is queued. Buy Pet Food from Rewards.',
    label: 'Resting',
    tone: 'muted',
  };
}
