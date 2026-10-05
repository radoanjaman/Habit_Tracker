import { Check, Clock, X } from 'lucide-react';
import { useStats } from '../../hooks/useStats';
import { fmt } from '../../lib/dates';
import { getGoalIcon } from '../../lib/icons';
import { EmptyState } from '../ui/EmptyState';
import { STATUS_LABEL } from '../ui/StatusMark';
import { CalendarX } from 'lucide-react';

export function DailyHistory({ date }: { date: string }) {
  const stats = useStats();
  const entries = stats.history(date);
  const dayStatus = stats.status(date);
  const past = date < stats.today;

  return (
    <section aria-labelledby="daily-overview" className="rounded-card border border-line bg-card p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 id="daily-overview" className="text-base font-semibold">
          Daily Overview · {fmt(date, 'EEE, MMM d')}
        </h2>
        {entries.length > 0 && <span className="text-xs text-sub">{STATUS_LABEL[dayStatus]}</span>}
      </div>
      {entries.length === 0 ? (
        <EmptyState icon={CalendarX} title="No goals on this day" />
      ) : (
        <ul className="space-y-3">
          {entries.map(({ goal, completed }) => {
            const Icon = getGoalIcon(goal.icon);
            const state = completed ? 'Completed' : past ? 'Missed' : date === stats.today ? 'Pending' : 'Upcoming';
            const StateIcon = completed ? Check : past ? X : Clock;
            return (
              <li key={goal.id} className="flex items-center gap-3 text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface2 text-accent">
                  <Icon size={15} aria-hidden />
                </span>
                <span className="min-w-0 flex-1 truncate">{goal.title}</span>
                <span
                  className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                    completed ? 'bg-accent text-bg' : 'border border-line text-sub'
                  }`}
                >
                  <StateIcon size={12} aria-hidden /> {state}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
