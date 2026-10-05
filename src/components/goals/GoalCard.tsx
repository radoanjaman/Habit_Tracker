import { Pencil, Trash2 } from 'lucide-react';
import type { Goal } from '../../types';
import { getGoalIcon } from '../../lib/icons';
import { GoalCheckbox } from './GoalCheckbox';

interface Props {
  goal: Goal;
  completed: boolean;
  canToggle: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function GoalCard({ goal, completed, canToggle, onToggle, onEdit, onDelete }: Props) {
  const Icon = getGoalIcon(goal.icon);
  const btn = 'rounded-full p-2 text-mute transition-colors duration-200 hover:bg-surface2 hover:text-ink';
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition-colors duration-200 hover:border-accent/40">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface2 text-accent">
        <Icon size={16} aria-hidden />
      </span>
      <GoalCheckbox checked={completed} onChange={onToggle} disabled={!canToggle}>
        {goal.title}
      </GoalCheckbox>
      <button type="button" aria-label={`Edit ${goal.title}`} onClick={onEdit} className={btn}>
        <Pencil size={15} />
      </button>
      <button type="button" aria-label={`Delete ${goal.title}`} onClick={onDelete} className={btn}>
        <Trash2 size={15} />
      </button>
    </li>
  );
}
