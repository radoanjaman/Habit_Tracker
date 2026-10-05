import type { GoalFormValues } from '../lib/schema';

export interface PopularGoal {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  image?: string;
  prefill: Partial<GoalFormValues>;
}

export const POPULAR_GOALS: PopularGoal[] = [
  {
    id: 'eat',
    title: 'Eat & drink healthy',
    tagline: 'Stay healthy, track your food and water.',
    icon: 'apple',
    image: '/images/healthy-food.jpg',
    prefill: { title: 'Eat & drink healthy', description: 'Balanced meals and enough water.', category: 'Health', icon: 'apple', frequencyType: 'daily' },
  },
  {
    id: 'workout',
    title: 'Workout regularly',
    tagline: 'Stronger body, better mind.',
    icon: 'dumbbell',
    image: '/images/workout.jpg',
    prefill: { title: 'Workout regularly', description: 'At least 30 minutes of movement.', category: 'Fitness', icon: 'dumbbell', frequencyType: 'days', days: [1, 3, 5] },
  },
  {
    id: 'read',
    title: 'Read & Learn',
    tagline: 'Build your knowledge.',
    icon: 'book-open',
    image: '/images/reading.jpg',
    prefill: { title: 'Read & Learn', description: 'Read or study something new.', category: 'Learning', icon: 'book-open', frequencyType: 'daily' },
  },
  {
    id: 'sleep',
    title: 'Better Sleep',
    tagline: 'Rest today, perform tomorrow.',
    icon: 'moon',
    image: '/images/sleep.jpg',
    prefill: { title: 'Better Sleep', description: 'Lights out on time, 7–8 hours.', category: 'Health', icon: 'moon', frequencyType: 'daily' },
  },
];

