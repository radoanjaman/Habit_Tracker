export const GOAL_CATEGORIES = ['Health', 'Fitness', 'Learning', 'Personal', 'Other'] as const;
export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export type ScheduleType = 'once' | 'daily' | 'weekdays' | 'days';

/** Recurrence rule. `days` uses date-fns getDay() numbering: 0 = Sunday ... 6 = Saturday. */
export interface GoalSchedule {
  type: ScheduleType;
  days: number[];
}
export type GoalFrequency = GoalSchedule;

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  icon?: string;
  /** ISO date `yyyy-MM-dd` */
  startDate: string;
  endDate?: string;
  frequency: GoalFrequency;
  /** `HH:mm` */
  reminderTime?: string;
  createdAt: string;
}

export interface GoalCompletion {
  id: string;
  goalId: string;
  /** ISO date `yyyy-MM-dd` */
  date: string;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  dateOfBirth?: string;

  height?: {
    value: number;
    unit: 'cm' | 'ft';
  };

  weight?: {
    value: number;
    unit: 'kg' | 'lb';
  };

  primaryGoal?: string;

  target?: {
    type: string;
    value?: number;
    unit?: string;
  };

  preferredTime?: 'morning' | 'afternoon' | 'evening' | 'flexible';

  daysPerWeek?: number;

  selectedHabits?: string[];

  onboardingCompleted: boolean;

  createdAt: string;
  updatedAt: string;
  
  avatarUrl?: string;

  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  achievementsUnlocked: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'goal' | 'streak' | 'weekly' | 'milestone' | 'special';
  icon: string;
  requirement: {
    type: string;
    value?: number;
    title?: string;
    category?: string;
  };
  xpReward: number;
  unlocked?: boolean;
  unlockedAt?: string;
}

export type ReminderMode = 'Daily' | 'Weekdays' | 'Off';

export interface AppSettings {
  theme: 'dark';
  notifications: boolean;
  reminders: ReminderMode;
  language: 'English';
}

/** Everything that is persisted. This is the unit a remote backend (e.g. Supabase) would sync. */
export interface PersistedData {
  profile: UserProfile;
  goals: Goal[];
  completions: GoalCompletion[];
  settings: AppSettings;
}

export type DayStatus = 'completed' | 'partial' | 'missed' | 'pending' | 'upcoming' | 'none';

