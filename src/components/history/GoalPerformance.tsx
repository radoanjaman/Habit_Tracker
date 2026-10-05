import { ChevronRight } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { getGoalIcon } from '../../lib/icons';
import { useStats } from '../../hooks/useStats';

interface Props {
  title: string;
  /** Dates (week, month, ...) over which each goal's completion is measured. */
  dates: string[];
  caption?: string;
}

export function GoalPerformance({ title, dates, caption }: Props) {
  const stats = useStats();
  const rows = stats.goals
    .map((g) => ({ goal: g, ...stats.rate(g.id, dates) }))
    .filter((r) => r.scheduled > 0);

  return (
    <section aria-labelledby="goal-performance" className="rounded-card border border-line bg-card p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 id="goal-performance" className="text-base font-semibold">
            {title}
          </h2>
          {caption && <p className="text-xs text-sub">{caption}</p>}
        </div>
        <ChevronRight size={16} className="text-mute" aria-hidden />
      </div>
      {rows.length === 0 ? (
        <p className="py-4 text-center text-sm text-sub">No scheduled goals in this period.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map(({ goal, done, scheduled, percent }) => {
            const Icon = getGoalIcon(goal.icon);
            return (
              <li key={goal.id} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface2 text-accent">
                  <Icon size={15} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                    <span className="truncate">{goal.title}</span>
                    <span className="shrink-0 text-xs text-sub">
                      {done}/{scheduled}
                    </span>
                  </div>
                  <ProgressBar value={percent} label={`${goal.title}: ${done} of ${scheduled}`} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
