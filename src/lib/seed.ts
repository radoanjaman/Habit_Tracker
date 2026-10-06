import { addDays } from 'date-fns';
import type { AppSettings, Goal, GoalCompletion, PersistedData, UserProfile } from '../types';
import { toKey } from './dates';

/* ------------------------------------------------------------------ *
 * DEMO SEED DATA – generated on first launch so the app never looks   *
 * empty. Users can wipe it from Settings → Clear All Data.            *
 * ------------------------------------------------------------------ */

export const defaultProfile: UserProfile = {
  id: 'demo-user',
  name: '',
  dateOfBirth: '2004-01-15',
  primaryGoal: 'Build a Healthy Lifestyle',
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  achievementsUnlocked: [],
};

export const defaultSettings: AppSettings = {
  theme: 'dark',
  notifications: true,
  reminders: 'Daily',
  language: 'English',
};

const DEMO_GOALS: Array<Pick<Goal, 'id' | 'title' | 'category' | 'icon'>> = [
  { id: 'seed-eat', title: 'Eat healthy meals', category: 'Health', icon: 'apple' },
  { id: 'seed-water', title: 'Drink 2.5L water', category: 'Health', icon: 'droplets' },
  { id: 'seed-workout', title: 'Workout for 30 minutes', category: 'Fitness', icon: 'dumbbell' },
  { id: 'seed-read', title: 'Read 20 pages', category: 'Learning', icon: 'book-open' },
];

export function createSeedData(now: Date = new Date()): PersistedData {
  const startDate = toKey(addDays(now, -28));
  const goals: Goal[] = DEMO_GOALS.map((g) => ({
    ...g,
    startDate,
    frequency: { type: 'daily', days: [] },
    createdAt: addDays(now, -28).toISOString(),
  }));

  const completions: GoalCompletion[] = [];
  const mark = (goalId: string, date: string) =>
    completions.push({ id: `${goalId}_${date}`, goalId, date, completed: true });

  // Deterministic pattern: last 12 days perfect (a streak), day 13 partial, earlier days mixed.
  for (let offset = 1; offset <= 28; offset++) {
    const date = toKey(addDays(now, -offset));
    goals.forEach((goal, i) => {
      const done = offset <= 12 || (offset === 13 ? i === 0 : (offset * 7 + i * 5) % 10 < 7);
      if (done) mark(goal.id, date);
    });
  }
  // Today: 2 of 4 done -> 50%
  const today = toKey(now);
  mark(goals[0].id, today);
  mark(goals[1].id, today);

  return { profile: { ...defaultProfile }, goals, completions, settings: { ...defaultSettings } };
}

export const createEmptyData = (): PersistedData => ({
  profile: { ...defaultProfile, name: '', dateOfBirth: '', primaryGoal: 'My main goal', onboardingCompleted: false },
  goals: [],
  completions: [],
  settings: { ...defaultSettings },
});
