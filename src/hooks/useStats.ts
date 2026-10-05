import { useMemo } from 'react';
import { useTracker } from '../store/tracker';
import { todayKey } from '../lib/dates';
import {
  getDailyProgress,
  getDayStatus,
  getGoalCompletionRate,
  getHistoryForDate,
  getRangeProgress,
  getScheduledGoals,
  getStreak,
  isGoalDone,
  makeCtx,
} from '../lib/stats';

/** Reactive derived stats: recomputed only when goals or completions change. */
export function useStats() {
  const goals = useTracker((s) => s.goals);
  const completions = useTracker((s) => s.completions);

  return useMemo(() => {
    const ctx = makeCtx(goals, completions);
    const today = todayKey();
    return {
      today,
      goals,
      scheduled: (d: string) => getScheduledGoals(ctx, d),
      isDone: (goalId: string, d: string) => isGoalDone(ctx, goalId, d),
      daily: (d: string) => getDailyProgress(ctx, d),
      status: (d: string) => getDayStatus(ctx, d, today),
      range: (dates: string[]) => getRangeProgress(ctx, dates, today),
      streak: () => getStreak(ctx, today),
      rate: (goalId: string, dates: string[]) => getGoalCompletionRate(ctx, goalId, dates),
      history: (d: string) => getHistoryForDate(ctx, d),
    };
  }, [goals, completions]);
}
