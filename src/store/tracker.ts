import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AppSettings, Goal, GoalCompletion, PersistedData, UserProfile } from '../types';
import { isValidKey, monthStartKey, sameMonth, todayKey, weekDays, weekStartKey } from '../lib/dates';
import { createEmptyData, createSeedData } from '../lib/seed';
import { safeStorage } from '../lib/storage';
import {
  getDailyProgress,
  getGoalCompletionRate,
  getHistoryForDate,
  getRangeProgress,
  getStreak,
  makeCtx,
} from '../lib/stats';
import { monthDays } from '../lib/dates';

export type NewGoal = Omit<Goal, 'id' | 'createdAt'>;

interface TrackerState extends PersistedData {
  selectedDate: string;
  selectedMonth: string;
  selectedWeek: string;

  addGoal: (input: NewGoal) => Goal;
  updateGoal: (id: string, patch: Partial<NewGoal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoalCompletion: (goalId: string, date: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedMonth: (month: string) => void;
  setSelectedWeek: (week: string) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetData: () => void;
  loadDemoData: () => void;

  getDailyProgress: (date: string) => ReturnType<typeof getDailyProgress>;
  getWeeklyProgress: (anyDateInWeek: string) => ReturnType<typeof getRangeProgress>;
  getMonthlyProgress: (anyDateInMonth: string) => ReturnType<typeof getRangeProgress>;
  getStreak: () => ReturnType<typeof getStreak>;
  getGoalCompletionRate: (goalId: string, dates: string[]) => ReturnType<typeof getGoalCompletionRate>;
  getHistoryForDate: (date: string) => ReturnType<typeof getHistoryForDate>;
}

const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const isGoalLike = (g: unknown): g is Goal => {
  const x = g as Goal | null;
  return (
    !!x &&
    typeof x.id === 'string' &&
    typeof x.title === 'string' &&
    isValidKey(String(x.startDate)) &&
    !!x.frequency &&
    Array.isArray(x.frequency.days)
  );
};

const isCompletionLike = (c: unknown): c is GoalCompletion => {
  const x = c as GoalCompletion | null;
  return !!x && typeof x.goalId === 'string' && isValidKey(String(x.date)) && typeof x.completed === 'boolean';
};

const initialSelection = () => {
  const t = todayKey();
  return { selectedDate: t, selectedMonth: monthStartKey(t), selectedWeek: weekStartKey(t) };
};

export const useTracker = create<TrackerState>()(
  persist(
    (set, get) => {
      const ctx = () => makeCtx(get().goals, get().completions);
      return {
        ...createSeedData(),
        ...initialSelection(),

        addGoal: (input) => {
          const goal: Goal = { ...input, id: newId(), createdAt: new Date().toISOString() };
          set((s) => ({ goals: [...s.goals, goal] }));
          return goal;
        },
        updateGoal: (id, patch) =>
          set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
        deleteGoal: (id) =>
          set((s) => ({
            goals: s.goals.filter((g) => g.id !== id),
            completions: s.completions.filter((c) => c.goalId !== id),
          })),
        toggleGoalCompletion: (goalId, date) =>
          set((s) => {
            const existing = s.completions.find((c) => c.goalId === goalId && c.date === date);
            if (!existing) {
              return { completions: [...s.completions, { id: `${goalId}_${date}`, goalId, date, completed: true }] };
            }
            return {
              completions: s.completions.map((c) => (c === existing ? { ...c, completed: !c.completed } : c)),
            };
          }),

        setSelectedDate: (date) =>
          set({ selectedDate: date, selectedMonth: monthStartKey(date), selectedWeek: weekStartKey(date) }),
        setSelectedMonth: (month) => {
          const t = todayKey();
          const m = monthStartKey(month);
          set({ selectedMonth: m, selectedDate: sameMonth(t, m) ? t : m, selectedWeek: weekStartKey(sameMonth(t, m) ? t : m) });
        },
        setSelectedWeek: (week) => {
          const t = todayKey();
          const w = weekStartKey(week);
          const date = weekDays(w).includes(t) ? t : w;
          set({ selectedWeek: w, selectedDate: date, selectedMonth: monthStartKey(date) });
        },

        updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
        updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
        resetData: () => set({ ...createEmptyData(), ...initialSelection() }),
        loadDemoData: () => set({ ...createSeedData(), ...initialSelection() }),

        getDailyProgress: (date) => getDailyProgress(ctx(), date),
        getWeeklyProgress: (d) => getRangeProgress(ctx(), weekDays(d), todayKey()),
        getMonthlyProgress: (d) => getRangeProgress(ctx(), monthDays(d), todayKey()),
        getStreak: () => getStreak(ctx(), todayKey()),
        getGoalCompletionRate: (goalId, dates) => getGoalCompletionRate(ctx(), goalId, dates),
        getHistoryForDate: (date) => getHistoryForDate(ctx(), date),
      };
    },
    {
      name: 'habit-tracker:v2',
      version: 2,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s): PersistedData => ({
        profile: s.profile,
        goals: s.goals,
        completions: s.completions,
        settings: s.settings,
      }),
      // Validate whatever came out of storage; fall back to current (seed) state if malformed.
      merge: (persisted, current) => {
        const p = persisted as Partial<PersistedData> | undefined;
        if (!p || !Array.isArray(p.goals) || !Array.isArray(p.completions) || !p.profile || !p.settings) {
          return current;
        }
        return {
          ...current,
          goals: p.goals.filter(isGoalLike),
          completions: p.completions.filter(isCompletionLike),
          profile: { ...current.profile, ...p.profile },
          settings: { ...current.settings, ...p.settings },
        };
      },
    },
  ),
);
