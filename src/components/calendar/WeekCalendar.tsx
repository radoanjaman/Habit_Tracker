import { ChevronLeft, ChevronRight } from 'lucide-react';
import { iconButtonClass } from '../ui/PageHeader';
import { ProgressBar } from '../ui/ProgressBar';
import { StatusMark, STATUS_LABEL } from '../ui/StatusMark';
import { cn } from '../../lib/cn';
import { fmt, weekDays } from '../../lib/dates';
import { useStats } from '../../hooks/useStats';

interface Props {
  week: string;
  selectedDate: string;
  onSelect: (date: string) => void;
  onWeekChange: (delta: number) => void;
}

export function WeekCalendar({ week, selectedDate, onSelect, onWeekChange }: Props) {
  const stats = useStats();
  const days = weekDays(week);

  return (
    <section aria-label="Week view" className="rounded-card border border-line bg-card p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" aria-label="Previous week" onClick={() => onWeekChange(-1)} className={iconButtonClass}>
          <ChevronLeft size={18} />
        </button>
        <h2 aria-live="polite" className="text-base font-semibold">
          {fmt(days[0], 'MMM d')} – {fmt(days[6], 'MMM d, yyyy')}
        </h2>
        <button type="button" aria-label="Next week" onClick={() => onWeekChange(1)} className={iconButtonClass}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid gap-2 md:grid-cols-7">
        {days.map((d) => {
          const p = stats.daily(d);
          const status = stats.status(d);
          const selected = d === selectedDate;
          return (
            <button
              key={d}
              type="button"
              aria-pressed={selected}
              aria-label={`${fmt(d, 'EEEE, MMMM d')}: ${p.total === 0 ? 'no goals' : `${p.percent}% complete`}`}
              onClick={() => onSelect(d)}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors duration-200 md:flex-col md:items-stretch md:gap-2',
                selected ? 'border-accent bg-surface2' : 'border-line bg-surface hover:border-accent/40',
                d === stats.today && 'ring-1 ring-accent/60',
              )}
            >
              <div className="w-14 shrink-0 md:w-auto">
                <p className="text-xs text-sub">{fmt(d, 'EEE')}</p>
                <p className="text-lg font-semibold leading-tight">{fmt(d, 'd')}</p>
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <ProgressBar value={p.percent} />
                <p className="flex items-center gap-1.5 text-xs text-sub">
                  <StatusMark status={status} />
                  {p.total === 0 ? STATUS_LABEL.none : `${p.percent}%`}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
