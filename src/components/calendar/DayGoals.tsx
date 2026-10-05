import { useState } from 'react';
import { CalendarPlus, CalendarX } from 'lucide-react';
import { GoalCard } from '../goals/GoalCard';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { useStats } from '../../hooks/useStats';
import { useTracker } from '../../store/tracker';
import { useUiStore } from '../../store/ui';
import { fmt } from '../../lib/dates';
import type { Goal } from '../../types';

/** Goals planned for a single date, with completion toggles and planning actions. */
export function DayGoals({ date }: { date: string }) {
  const stats = useStats();
  const toggle = useTracker((s) => s.toggleGoalCompletion);
  const deleteGoal = useTracker((s) => s.deleteGoal);
  const { openGoalModal, openEditGoal } = useUiStore();
  const [toDelete, setToDelete] = useState<Goal | null>(null);

  const goals = stats.scheduled(date);
  const progress = stats.daily(date);
  const canToggle = date <= stats.today;

  return (
    <section aria-labelledby="day-goals" className="rounded-card border border-line bg-card p-4 shadow-soft sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id="day-goals" className="text-base font-semibold">
            {fmt(date, 'EEEE, MMM d')}
          </h2>
          <p className="text-xs text-sub">
            {progress.total === 0 ? 'No goals' : `${progress.completed} / ${progress.total} completed`}
            {!canToggle && ' · upcoming'}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => openGoalModal({ startDate: date, frequencyType: 'once' })}>
          <CalendarPlus size={14} /> Add goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState icon={CalendarX} title="No goals planned for this day" />
      ) : (
        <ul className="space-y-2">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              completed={stats.isDone(g.id, date)}
              canToggle={canToggle}
              onToggle={() => toggle(g.id, date)}
              onEdit={() => openEditGoal(g)}
              onDelete={() => setToDelete(g)}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete goal?"
        message={`“${toDelete?.title ?? ''}” and its completion history will be removed from every day.`}
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteGoal(toDelete.id);
          setToDelete(null);
        }}
      />
    </section>
  );
}
