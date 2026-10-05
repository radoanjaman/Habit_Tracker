import type { InputHTMLAttributes, ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}

/** Native checkbox (keyboard + screen-reader friendly) with custom visuals. */
export function GoalCheckbox({ checked, onChange, children, disabled, className, ...rest }: Props) {
  return (
    <label
      className={cn(
        'group flex min-w-0 flex-1 items-center gap-3 text-sm',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} disabled={disabled} {...rest} />
      <span
        aria-hidden
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg',
          checked ? 'scale-100 border-accent bg-accent text-bg' : 'border-[#4A4D3C] bg-bg/40 text-transparent group-hover:border-accent/70',
        )}
      >
        <Check size={14} strokeWidth={3.5} className={cn('transition-transform duration-200', checked ? 'scale-100' : 'scale-0')} />
      </span>
      <span className={cn('truncate transition-colors duration-200', checked ? 'text-mute line-through' : 'text-ink')}>
        {children}
      </span>
    </label>
  );
}
