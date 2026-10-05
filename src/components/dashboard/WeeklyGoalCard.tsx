import { ProgressRing } from './ProgressRing';
import { ProgressBar } from '../ui/ProgressBar';
import { useStats } from '../../hooks/useStats';
import { weekDays } from '../../lib/dates';

/** Weekly snapshot shown beside the main card on wide screens. */
export function WeeklyGoalCard() {
  const stats = useStats();
  const week = stats.range(weekDays(stats.today));
  const percent = week.percent;
  const daysPercent = Math.round((week.daysCompleted / 7) * 100);

  return (
    <section aria-labelledby="weekly-goal" className="flex flex-col justify-center rounded-card border border-line bg-card p-5 shadow-soft sm:p-8">
      <h2 id="weekly-goal" className="mb-5 text-sm font-semibold text-sub">
        Goal Progress
      </h2>
      <div className="flex items-center gap-5">
        <ProgressRing percent={percent} strokeWidth={11} className="h-24 w-24 shrink-0" label="Weekly completion">
          <span className="text-lg font-bold">{percent}%</span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-sub">Weekly Goal</p>
          <p className="mb-2 text-sm font-semibold">{week.daysCompleted} / 7 days</p>
          <ProgressBar value={daysPercent} label="Days completed this week" />
        </div>
      </div>
    </section>
  );
}
