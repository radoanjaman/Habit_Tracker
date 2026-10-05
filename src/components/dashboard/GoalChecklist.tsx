import { Plus } from 'lucide-react';
import { GoalCheckbox } from '../goals/GoalCheckbox';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { useStats } from '../../hooks/useStats';
import { useTracker } from '../../store/tracker';
import { useUiStore } from '../../store/ui';
import { ListChecks } from 'lucide-react';

export function GoalChecklist({ date }: { date: string }) {
  const stats = useStats();
  const toggle = useTracker((s) => s.toggleGoalCompletion);
  const openGoalModal = useUiStore((s) => s.openGoalModal);
  const goals = stats.scheduled(date);

  if (goals.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No goals for today"
        action={
          <Button size="sm" onClick={() => openGoalModal()}>
            <Plus size={14} /> Create your first goal
          </Button>
        }
      />
    );
  }

  return (
    <ul className="space-y-3">
      {goals.map((g) => (
        <li key={g.id} className="flex">
          <GoalCheckbox checked={stats.isDone(g.id, date)} onChange={() => toggle(g.id, date)}>
            {g.title}
          </GoalCheckbox>
        </li>
      ))}
    </ul>
  );
}
