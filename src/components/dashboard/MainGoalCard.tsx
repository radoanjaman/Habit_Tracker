import { Plus } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { GoalChecklist } from './GoalChecklist';
import { useStats } from '../../hooks/useStats';
import { useTracker } from '../../store/tracker';
import { useUiStore } from '../../store/ui';

export function MainGoalCard() {
  const stats = useStats();
  const primaryGoal = useTracker((s) => s.profile.primaryGoal);
  const openGoalModal = useUiStore((s) => s.openGoalModal);
  const { percent } = stats.daily(stats.today);

  return (
    <section aria-labelledby="main-goal" className="rounded-card border border-line bg-card p-4 shadow-soft sm:p-8">
      <div className="flex items-center gap-4 sm:gap-10">
        <ProgressRing percent={percent} label="Daily goal progress" className="h-36 w-36 shrink-0 sm:h-56 sm:w-56">
          <span className="text-3xl font-bold sm:text-5xl">{percent}%</span>
          <span className="text-[11px] text-sub sm:text-sm">Daily Goal</span>
        </ProgressRing>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-sub sm:text-xs">Main Goal</p>
          <h2 id="main-goal" className="mb-3 text-lg font-bold leading-tight sm:text-3xl">
            {primaryGoal}
          </h2>
          <span className="mb-3 inline-block rounded-full bg-accent px-3 py-0.5 text-[11px] font-semibold text-bg sm:text-xs">
            Today’s Goal
          </span>
          <GoalChecklist date={stats.today} />
          <button
            type="button"
            onClick={() => openGoalModal()}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border border-accent/70 py-2 text-xs font-medium text-accent transition-colors duration-200 hover:bg-accent/10 sm:text-sm"
          >
            <Plus size={14} /> Add New Goal
          </button>
        </div>
      </div>
    </section>
  );
}
