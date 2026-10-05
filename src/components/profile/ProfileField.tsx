import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick: () => void;
}

export function ProfileField({ icon: Icon, label, value, onClick }: Props) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Edit ${label}, current value ${value || 'not set'}`}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm transition-colors duration-200 hover:bg-surface2"
      >
        <Icon size={18} className="shrink-0 text-sub" aria-hidden />
        <span className="flex-1">{label}</span>
        <span className="max-w-[50%] truncate text-sub">{value || 'Not set'}</span>
        <ChevronRight size={16} className="shrink-0 text-mute" aria-hidden />
      </button>
    </li>
  );
}
