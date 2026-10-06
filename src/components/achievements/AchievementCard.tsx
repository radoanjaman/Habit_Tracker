import { Achievement } from '../../types';
import { cn } from '../../lib/cn';
import * as Icons from 'lucide-react';

interface Props {
  achievement: Achievement;
  isUnlocked: boolean;
}

export function AchievementCard({ achievement, isUnlocked }: Props) {
  const Icon = (Icons as any)[achievement.icon] || Icons.Award;

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center gap-3 rounded-card border p-4 transition-all',
        isUnlocked
          ? 'border-accent/40 bg-accent/10 shadow-soft'
          : 'border-line bg-surface/50 opacity-60 grayscale'
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
          isUnlocked ? 'bg-accent text-bg' : 'bg-surface2 text-sub'
        )}
      >
        <Icon size={24} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <h4 className="font-semibold text-text text-sm sm:text-base">{achievement.name}</h4>
        <p className="text-xs text-sub mt-1 leading-tight">{achievement.description}</p>
      </div>
      <div className="mt-auto shrink-0 pt-2 border-t border-line/10 w-full">
        {isUnlocked ? (
          <span className="text-xs font-bold text-accent uppercase tracking-wider">Unlocked</span>
        ) : (
          <span className="text-xs font-semibold text-sub">+{achievement.xpReward} XP</span>
        )}
      </div>
    </div>
  );
}
