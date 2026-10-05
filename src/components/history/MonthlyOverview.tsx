import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StatusMark } from '../ui/StatusMark';
import { iconButtonClass } from '../ui/PageHeader';
import { fmt, monthDays } from '../../lib/dates';
import { useStats } from '../../hooks/useStats';

interface Props {
  month: string;
  selectedDate: string;
  onSelect: (date: string) => void;
  onMonthChange: (delta: number) => void;
}

export function MonthlyOverview({ month, selectedDate, onSelect, onMonthChange }: Props) {
  const stats = useStats();
  const days = monthDays(month);
  const summary = stats.range(days);
  const data = days.map((d) => ({ date: d, day: Number(d.slice(8)), percent: stats.daily(d).percent }));

  return (
    <section aria-labelledby="this-month" className="rounded-card border border-line bg-card p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" aria-label="Previous month" onClick={() => onMonthChange(-1)} className={iconButtonClass}>
          <ChevronLeft size={18} />
        </button>
        <h2 id="this-month" className="text-base font-semibold">
          {fmt(month, 'MMMM yyyy')}
        </h2>
        <button type="button" aria-label="Next month" onClick={() => onMonthChange(1)} className={iconButtonClass}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="h-44 w-full" role="img" aria-label={`Daily completion for ${fmt(month, 'MMMM yyyy')}`}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#353C20" strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fill: '#686D5B', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tick={{ fill: '#686D5B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: '#202612' }}
              contentStyle={{ background: '#151A0B', border: '1px solid #353C20', borderRadius: 12, color: '#F5F7E9' }}
              formatter={(v: number) => [`${v}%`, 'Completed']}
              labelFormatter={(l) => `Day ${l}`}
            />
            <Bar dataKey="percent" radius={[4, 4, 0, 0]} onClick={(_, i) => onSelect(data[i].date)} cursor="pointer">
              {data.map((d) => (
                <Cell key={d.date} fill={d.date === selectedDate ? '#E8FF3D' : '#B9D62A'} fillOpacity={d.date === selectedDate ? 1 : 0.55} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface py-3 text-center">
        {(
          [
            ['Completed', summary.daysCompleted, 'completed'],
            ['Missed', summary.daysMissed, 'missed'],
            ['Partial', summary.daysPartial, 'partial'],
          ] as const
        ).map(([label, value, status]) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <dt className="order-2 text-xs text-sub">{label}</dt>
            <dd className="order-1 flex items-center gap-1.5 text-lg font-semibold">
              <StatusMark status={status} /> {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
