import { ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Props {
  icon: LucideIcon;
  label: string;
  value?: string;
  onClick?: () => void;
  /** Renders an accessible switch instead of a chevron. */
  toggle?: { checked: boolean; onChange: (v: boolean) => void };
}

const rowClass = 'flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm';

export function SettingsRow({ icon: Icon, label, value, onClick, toggle }: Props) {
  const content = (
    <>
      <Icon size={18} className="shrink-0 text-sub" aria-hidden />
      <span className="flex-1">{label}</span>
      {value && <span className="text-sub">{value}</span>}
    </>
  );

  if (toggle) {
    return (
      <li className={rowClass}>
        {content}
        <button
          type="button"
          role="switch"
          aria-checked={toggle.checked}
          aria-label={label}
          onClick={() => toggle.onChange(!toggle.checked)}
          className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200', toggle.checked ? 'bg-accent' : 'bg-surface2 ring-1 ring-line')}
        >
          <span
            aria-hidden
            className={cn('absolute top-0.5 h-5 w-5 rounded-full transition-all duration-200', toggle.checked ? 'left-[22px] bg-bg' : 'left-0.5 bg-sub')}
          />
        </button>
      </li>
    );
  }

  if (!onClick) return <li className={rowClass}>{content}</li>;

  return (
    <li>
      <button type="button" onClick={onClick} className={cn(rowClass, 'transition-colors duration-200 hover:bg-surface2')}>
        {content}
        <ChevronRight size={16} className="shrink-0 text-mute" aria-hidden />
      </button>
    </li>
  );
}
