import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { PopularGoal } from '../../data/popularGoals';
import { getGoalIcon } from '../../lib/icons';

interface Props {
  goal: PopularGoal;
  onSelect: (goal: PopularGoal) => void;
}

export function PopularGoalCard({ goal, onSelect }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const Icon = getGoalIcon(goal.icon);
  const showImage = goal.image && !imageFailed;

  return (
    <button
      type="button"
      onClick={() => onSelect(goal)}
      aria-label={`Add goal: ${goal.title}`}
      className="group flex h-60 w-44 shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-line bg-card text-left shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-accent/50 sm:w-auto"
    >
      <div className="relative h-24 shrink-0 overflow-hidden bg-surface2 sm:h-28">
        {showImage ? (
          <img
            src={goal.image}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-accent/80">
            <Icon size={36} strokeWidth={1.5} aria-hidden />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-4 pt-2">
        <h3 className="text-sm font-semibold leading-snug">{goal.title}</h3>
        <p className="mt-1 text-xs leading-snug text-sub">{goal.tagline}</p>
        <span className="mt-auto flex h-8 w-8 items-center justify-center rounded-full bg-accent text-bg transition-transform duration-200 group-hover:translate-x-1">
          <ArrowRight size={16} aria-hidden />
        </span>
      </div>
    </button>
  );
}
