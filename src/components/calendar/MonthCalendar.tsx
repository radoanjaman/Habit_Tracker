import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDay } from './CalendarDay';
import { fmt, monthGridDays, sameMonth } from '../../lib/dates';
import { useStats } from '../../hooks/useStats';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface Props {
  month: string;
  selectedDate: string;
  onSelect: (date: string) => void;
  onMonthChange: (delta: number) => void;
}

export function MonthCalendar({ month, selectedDate, onSelect, onMonthChange }: Props) {
  const stats = useStats();
  const days = monthGridDays(month);

  return (
    <section aria-label="Month calendar" className="rounded-card border border-line bg-card p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(-1)}
          className="rounded-full p-2 text-mute transition-colors duration-200 hover:text-ink"
        >
          <ChevronLeft size={16} />
        </button>
        <h2 aria-live="polite" className="text-sm font-semibold">
          {fmt(month, 'MMMM yyyy')}
        </h2>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(1)}
          className="rounded-full p-2 text-mute transition-colors duration-200 hover:text-ink"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-x-1 gap-y-2">

        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-1 text-center text-xs text-mute">
            {d}
          </div>
        ))}
        {days.map((d) => (
          <CalendarDay
            key={d}
            date={d}
            inMonth={sameMonth(d, month)}
            selected={d === selectedDate}
            today={d === stats.today}
            status={stats.status(d)}
            onSelect={onSelect}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-sub" aria-label="Legend">
        <Legend text="Completed" cls="bg-accent" />
        <Legend text="Partial" cls="border-2 border-accent2 bg-accent/25" />
        <Legend text="Missed" cls="bg-surface2 ring-1 ring-mute" />
        <Legend text="Planned" cls="border border-mute" />
      </ul>
    </section>
  );
}

function Legend({ text, cls }: { text: string; cls: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span aria-hidden className={`h-2 w-2 rounded-full ${cls}`} /> {text}
    </li>
  );
}
