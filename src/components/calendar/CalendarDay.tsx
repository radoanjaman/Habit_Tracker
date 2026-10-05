import { cn } from '../../lib/cn';
import { fmt } from '../../lib/dates';
import type { DayStatus } from '../../types';
import { STATUS_LABEL } from '../ui/StatusMark';

interface Props {
  date: string;
  inMonth: boolean;
  selected: boolean;
  today: boolean;
  status: DayStatus;
  onSelect: (date: string) => void;
}

/**
 * Visual states (not color-only – fill, ring and dot shape differ too):
 * selected = bright lime disc, completed = solid green disc, missed = black disc,
 * today = lime ring, planned/partial = dark disc with a dot underneath.
 */
function dotClass(status: DayStatus, filled: boolean): string {
  if (status === 'none') return '';
  if (filled) return 'h-1 w-1 rounded-full bg-bg';
  if (status === 'partial') return 'h-1.5 w-1.5 rounded-full border border-accent';
  if (status === 'missed') return 'h-1 w-1 rounded-full bg-mute';
  return 'h-1 w-1 rounded-full bg-accent';
}

export function CalendarDay({ date, inMonth, selected, today, status, onSelect }: Props) {
  const completed = status === 'completed';
  const filled = selected || (inMonth && completed);

  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      aria-pressed={selected}
      aria-current={today ? 'date' : undefined}
      aria-label={`${fmt(date, 'EEEE, MMMM d')}${today ? ', today' : ''}: ${STATUS_LABEL[status]}`}
      className={cn(
        'mx-auto flex aspect-square w-full max-w-[44px] flex-col items-center justify-center gap-[3px] rounded-full text-sm font-medium transition-colors duration-200',
        selected
          ? 'bg-accent font-semibold text-bg'
          : !inMonth
            ? 'text-mute hover:bg-surface2'
            : completed
              ? 'bg-[#7E9A22] text-bg'
              : status === 'missed'
                ? 'bg-black text-sub'
                : 'bg-[#1E2410] text-ink hover:bg-surface2',
        today && !selected && 'ring-1 ring-accent',
      )}
    >
      <span className="leading-none">{Number(date.slice(8))}</span>
      <span className="flex h-1.5 items-center">
        {inMonth || selected ? <span aria-hidden className={dotClass(status, filled)} /> : null}
      </span>
    </button>
  );
}
