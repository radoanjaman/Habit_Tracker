import { Check, Minus, X } from 'lucide-react';
import type { DayStatus } from '../../types';
import { cn } from '../../lib/cn';

export const STATUS_LABEL: Record<DayStatus, string> = {
  completed: 'Completed',
  partial: 'Partial',
  missed: 'Missed',
  pending: 'Pending',
  upcoming: 'Upcoming',
  none: 'No goals',
};

/** Status is conveyed by shape as well as tone, never color alone. */
export function StatusMark({ status, className }: { status: DayStatus; className?: string }) {
  const base = 'flex h-3.5 w-3.5 items-center justify-center rounded-full';
  switch (status) {
    case 'completed':
      return (
        <span aria-hidden className={cn(base, 'bg-accent text-bg', className)}>
          <Check size={9} strokeWidth={4} />
        </span>
      );
    case 'partial':
      return (
        <span aria-hidden className={cn(base, 'border-2 border-accent2 bg-accent/25', className)} />
      );
    case 'missed':
      return (
        <span aria-hidden className={cn(base, 'bg-surface2 text-sub ring-1 ring-mute', className)}>
          <X size={9} strokeWidth={4} />
        </span>
      );
    case 'pending':
    case 'upcoming':
      return <span aria-hidden className={cn(base, 'border border-mute', className)} />;
    case 'none':
      return (
        <span aria-hidden className={cn(base, 'text-mute/60', className)}>
          <Minus size={10} />
        </span>
      );
  }
}
