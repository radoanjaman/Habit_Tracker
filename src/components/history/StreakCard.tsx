import { Flame } from 'lucide-react';
import { useStats } from '../../hooks/useStats';
import { shiftKey } from '../../lib/dates';

const BARS = 10;

export function StreakCard() {
  const stats = useStats();
  const { current, longest } = stats.streak();
  const recent = Array.from({ length: BARS }, (_, i) => shiftKey(stats.today, i - (BARS - 1)));

  return (
    <section aria-labelledby="streak" className="rounded-card border border-line bg-card p-4 shadow-soft sm:p-6">
      <h2 id="streak" className="mb-3 text-sm font-semibold text-sub">
        Goal Streak
      </h2>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <Flame size={36} className="text-accent" aria-hidden />
          <div>
            <p className="text-2xl font-bold">
              {current} {current === 1 ? 'day' : 'days'}
            </p>
            <p className="text-xs text-sub">
              Longest streak: {longest} {longest === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>
        <div className="flex h-12 items-end gap-1" role="img" aria-label="Daily completion, last 10 days">
          {recent.map((d) => {
            const { percent, total } = stats.daily(d);
            return (
              <span
                key={d}
                className="w-1.5 rounded-full bg-accent transition-[height] duration-500"
                style={{ height: `${Math.max(total === 0 ? 8 : percent, 8)}%`, opacity: total === 0 ? 0.2 : 0.4 + percent / 170 }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
