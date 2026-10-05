import { getDay } from 'date-fns';
import type { DayStatus, Goal, GoalCompletion } from '../types';
import { fromKey, shiftKey } from './dates';

/** Pre-indexed data so per-day lookups are O(1). */
export interface StatsCtx {
  goals: Goal[];
  done: Set<string>;
}

const doneKey = (goalId: string, date: string) => `${goalId}|${date}`;

export const makeCtx = (goals: Goal[], completions: GoalCompletion[]): StatsCtx => ({
  goals,
  done: new Set(completions.filter((c) => c.completed).map((c) => doneKey(c.goalId, c.date))),
});

export const isGoalDone = (ctx: StatsCtx, goalId: string, date: string): boolean =>
  ctx.done.has(doneKey(goalId, date));

export function isScheduledOn(goal: Goal, date: string): boolean {
  if (date < goal.startDate) return false;
  if (goal.endDate && date > goal.endDate) return false;
  const dow = getDay(fromKey(date));
  switch (goal.frequency.type) {
    case 'once':
      return date === goal.startDate;
    case 'daily':
      return true;
    case 'weekdays':
      return dow >= 1 && dow <= 5;
    case 'days':
      return goal.frequency.days.includes(dow);
  }
}

export const getScheduledGoals = (ctx: StatsCtx, date: string): Goal[] =>
  ctx.goals.filter((g) => isScheduledOn(g, date));

export interface Progress {
  completed: number;
  total: number;
  percent: number;
}

const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

export function getDailyProgress(ctx: StatsCtx, date: string): Progress {
  const scheduled = getScheduledGoals(ctx, date);
  const completed = scheduled.filter((g) => isGoalDone(ctx, g.id, date)).length;
  return { completed, total: scheduled.length, percent: pct(completed, scheduled.length) };
}

export function getDayStatus(ctx: StatsCtx, date: string, today: string): DayStatus {
  const { completed, total } = getDailyProgress(ctx, date);
  if (total === 0) return 'none';
  if (completed === total) return 'completed';
  if (date > today) return 'upcoming';
  if (date === today) return completed > 0 ? 'partial' : 'pending';
  return completed > 0 ? 'partial' : 'missed';
}

export interface RangeProgress extends Progress {
  daysCompleted: number;
  daysMissed: number;
  daysPartial: number;
  daysWithGoals: number;
}

/** Aggregate progress across any list of dates (week, month, ...). */
export function getRangeProgress(ctx: StatsCtx, dates: string[], today: string): RangeProgress {
  let completed = 0;
  let total = 0;
  let daysCompleted = 0;
  let daysMissed = 0;
  let daysPartial = 0;
  let daysWithGoals = 0;
  for (const d of dates) {
    const p = getDailyProgress(ctx, d);
    completed += p.completed;
    total += p.total;
    if (p.total > 0) daysWithGoals++;
    const s = getDayStatus(ctx, d, today);
    if (s === 'completed') daysCompleted++;
    else if (s === 'missed') daysMissed++;
    else if (s === 'partial') daysPartial++;
  }
  return {
    completed,
    total,
    percent: pct(completed, total),
    daysCompleted,
    daysMissed,
    daysPartial,
    daysWithGoals,
  };
}

const MAX_STREAK_LOOKBACK_DAYS = 1100;

/**
 * A "streak day" is a day on which every scheduled goal was completed.
 * Days without goals and an unfinished today are neutral (neither extend nor break).
 * A past partial/missed day breaks the streak.
 */
export function getStreak(ctx: StatsCtx, today: string): { current: number; longest: number } {
  let earliest = today;
  for (const g of ctx.goals) if (g.startDate < earliest) earliest = g.startDate;

  let run = 0;
  let longest = 0;
  let date = earliest;
  for (let i = 0; i < MAX_STREAK_LOOKBACK_DAYS && date <= today; i++) {
    const status = getDayStatus(ctx, date, today);
    if (status === 'completed') {
      run++;
      longest = Math.max(longest, run);
    } else if (status !== 'none' && date !== today) {
      run = 0;
    }
    date = shiftKey(date, 1);
  }
  return { current: run, longest };
}

export function getGoalCompletionRate(
  ctx: StatsCtx,
  goalId: string,
  dates: string[],
): { done: number; scheduled: number; percent: number } {
  const goal = ctx.goals.find((g) => g.id === goalId);
  if (!goal) return { done: 0, scheduled: 0, percent: 0 };
  let done = 0;
  let scheduled = 0;
  for (const d of dates) {
    if (!isScheduledOn(goal, d)) continue;
    scheduled++;
    if (isGoalDone(ctx, goalId, d)) done++;
  }
  return { done, scheduled, percent: pct(done, scheduled) };
}

export interface HistoryEntry {
  goal: Goal;
  completed: boolean;
}

export const getHistoryForDate = (ctx: StatsCtx, date: string): HistoryEntry[] =>
  getScheduledGoals(ctx, date).map((goal) => ({ goal, completed: isGoalDone(ctx, goal.id, date) }));
