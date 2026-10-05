import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusMark } from '../ui/StatusMark';
import { iconButtonClass } from '../ui/PageHeader';
import { cn } from '../../lib/cn';
import { fmt, weekDays } from '../../lib/dates';
import { useStats } from '../../hooks/useStats';

interface Props {
  week: string;
  selectedDate: string;
  onSelect: (date: string) => void;
  onWeekChange: (delta: number) => void;
}

export function WeeklyOverview({ week, selectedDate, onSelect, onWeekChange }: Props) {
  const stats = useStats();
  const days = weekDays(week);
  const summary = stats.range(days);

  return (
    <section aria-labelledby="this-week" className="rounded-card border border-line bg-card p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" aria-label="Previous week" onClick={() => onWeekChange(-1)} className={iconButtonClass}>
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <h2 id="this-week" className="text-base font-semibold">
            {days.includes(stats.today) ? 'This Week' : 'Week'}
          </h2>
          <p className="text-xs text-sub">
            {fmt(days[0], 'MMM d')} – {fmt(days[6], 'MMM d, yyyy')}
          </p>
        </div>
        <button type="button" aria-label="Next week" onClick={() => onWeekChange(1)} className={iconButtonClass}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((d) => {
          const selected = d === selectedDate;
          const status = stats.status(d);
          return (
            <button
              key={d}
              type="button"
              aria-pressed={selected}
              aria-label={`${fmt(d, 'EEEE, MMMM d')}: ${status}`}
              onClick={() => onSelect(d)}
              className="flex flex-col items-center gap-1.5 rounded-2xl py-1 transition-colors duration-200 hover:bg-surface2"
            >
              <span className="text-xs text-mute">{fmt(d, 'EEE')}</span>
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-200 sm:h-11 sm:w-11',
                  selected ? 'border-accent bg-accent text-bg' : 'border-line bg-surface',
                  d === stats.today && !selected && 'border-accent',
                )}
              >
                {fmt(d, 'd')}
              </span>
              <StatusMark status={status} />
            </button>
          );
        })}
      </div>

      <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface py-3 text-center">
        <Stat label="Completed" value={summary.daysCompleted} status="completed" />
        <Stat label="Missed" value={summary.daysMissed} status="missed" />
        <Stat label="Partial" value={summary.daysPartial} status="partial" />
      </dl>
    </section>
  );
}

function Stat({ label, value, status }: { label: string; value: number; status: 'completed' | 'missed' | 'partial' }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <dt className="order-2 text-xs text-sub">{label}</dt>
      <dd className="order-1 flex items-center gap-1.5 text-lg font-semibold">
        <StatusMark status={status} /> {value}
      </dd>
    </div>
  );
}
