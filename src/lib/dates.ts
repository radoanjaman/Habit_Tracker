import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export const DATE_FORMAT = 'yyyy-MM-dd';
const WEEK = { weekStartsOn: 1 } as const; // Monday first

export const toKey = (d: Date): string => format(d, DATE_FORMAT);
export const fromKey = (key: string): Date => parseISO(key);
export const todayKey = (): string => toKey(new Date());

export const isValidKey = (key: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(key) && isValid(parseISO(key));

export const shiftKey = (key: string, days: number): string => toKey(addDays(fromKey(key), days));

export const monthStartKey = (key: string): string => toKey(startOfMonth(fromKey(key)));
export const weekStartKey = (key: string): string => toKey(startOfWeek(fromKey(key), WEEK));

const range = (start: Date, end: Date): string[] =>
  eachDayOfInterval({ start, end }).map(toKey);

/** The 7 dates (Mon..Sun) of the week containing `key`. */
export const weekDays = (key: string): string[] => {
  const d = fromKey(key);
  return range(startOfWeek(d, WEEK), endOfWeek(d, WEEK));
};

/** Every date in the month containing `key`. */
export const monthDays = (key: string): string[] => {
  const d = fromKey(key);
  return range(startOfMonth(d), endOfMonth(d));
};

/** Full calendar grid: whole Monday-Sunday weeks covering the month. */
export const monthGridDays = (key: string): string[] => {
  const d = fromKey(key);
  return range(startOfWeek(startOfMonth(d), WEEK), endOfWeek(endOfMonth(d), WEEK));
};

export const sameMonth = (a: string, b: string): boolean => a.slice(0, 7) === b.slice(0, 7);

export const fmt = (key: string, pattern: string): string => format(fromKey(key), pattern);
