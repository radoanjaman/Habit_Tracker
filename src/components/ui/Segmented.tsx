import { cn } from '../../lib/cn';

interface Option<T extends string> {
  value: T;
  label: string;
}
interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}

export function Segmented<T extends string>({ options, value, onChange, ariaLabel }: Props<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className="grid auto-cols-fr grid-flow-col gap-1 rounded-full border border-line bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-200 sm:px-5 sm:text-sm',
            o.value === value ? 'bg-accent text-bg' : 'text-sub hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
