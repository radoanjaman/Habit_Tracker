import { z } from 'zod';
import { GOAL_CATEGORIES, type Goal } from '../types';
import { isValidKey, todayKey } from './dates';

export const goalFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Goal title is required').max(60, 'Keep it under 60 characters'),
    description: z.string().trim().max(200, 'Keep it under 200 characters'),
    category: z.enum(GOAL_CATEGORIES),
    frequencyType: z.enum(['daily', 'weekdays', 'days', 'once']),
    days: z.array(z.number().int().min(0).max(6)),
    startDate: z.string().refine(isValidKey, 'Enter a valid start date'),
    endDate: z.string().refine((v) => v === '' || isValidKey(v), 'Enter a valid end date'),
    reminderTime: z.string().refine((v) => v === '' || /^([01]\d|2[0-3]):[0-5]\d$/.test(v), 'Enter a valid time'),
    icon: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.frequencyType === 'days' && v.days.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['days'], message: 'Pick at least one day' });
    }
    if (isValidKey(v.startDate) && v.endDate && isValidKey(v.endDate) && v.endDate < v.startDate) {
      ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'End date must be on or after start date' });
    }
  });

export type GoalFormValues = z.infer<typeof goalFormSchema>;

export const emptyGoalForm = (date: string = todayKey()): GoalFormValues => ({
  title: '',
  description: '',
  category: 'Health',
  frequencyType: 'daily',
  days: [],
  startDate: date,
  endDate: '',
  reminderTime: '',
  icon: 'target',
});

export const goalToFormValues = (g: Goal): GoalFormValues => ({
  title: g.title,
  description: g.description ?? '',
  category: g.category,
  frequencyType: g.frequency.type,
  days: g.frequency.days,
  startDate: g.startDate,
  endDate: g.endDate ?? '',
  reminderTime: g.reminderTime ?? '',
  icon: g.icon ?? 'target',
});

export const formValuesToGoalInput = (v: GoalFormValues): Omit<Goal, 'id' | 'createdAt'> => ({
  title: v.title.trim(),
  description: v.description.trim() || undefined,
  category: v.category,
  icon: v.icon,
  startDate: v.startDate,
  endDate: v.endDate || undefined,
  reminderTime: v.reminderTime || undefined,
  frequency: { type: v.frequencyType, days: v.frequencyType === 'days' ? [...v.days].sort() : [] },
});

/** Schemas for single-field edits on the Mine page. */
export const profileSchemas = {
  fullName: z.string().trim().min(1, 'Name is required').max(60),
  email: z.string().trim().email('Enter a valid email'),
  dateOfBirth: z.string().refine((v) => isValidKey(v) && v <= todayKey(), 'Enter a valid date of birth'),
  gender: z.string().min(1, 'Select an option'),
  heightCm: z.coerce.number({ invalid_type_error: 'Enter a number' }).min(50, 'Too low').max(260, 'Too high'),
  weightKg: z.coerce.number({ invalid_type_error: 'Enter a number' }).min(20, 'Too low').max(400, 'Too high'),
  mainGoal: z.string().trim().min(1, 'Main goal is required').max(60),
};
