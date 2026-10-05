import {
  Apple,
  BookOpen,
  Brain,
  Coffee,
  Droplets,
  Dumbbell,
  Footprints,
  Heart,
  Moon,
  Target,
  type LucideIcon,
} from 'lucide-react';

export const GOAL_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  target: { icon: Target, label: 'Target' },
  apple: { icon: Apple, label: 'Food' },
  droplets: { icon: Droplets, label: 'Water' },
  dumbbell: { icon: Dumbbell, label: 'Workout' },
  'book-open': { icon: BookOpen, label: 'Reading' },
  moon: { icon: Moon, label: 'Sleep' },
  heart: { icon: Heart, label: 'Heart' },
  footprints: { icon: Footprints, label: 'Walking' },
  brain: { icon: Brain, label: 'Mind' },
  coffee: { icon: Coffee, label: 'Routine' },
};

export const getGoalIcon = (name?: string): LucideIcon => (name && GOAL_ICONS[name]?.icon) || Target;
