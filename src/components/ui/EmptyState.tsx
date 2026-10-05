import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface2 text-accent">
        <Icon size={22} />
      </div>
      <p className="font-semibold">{title}</p>
      {description && <p className="max-w-xs text-sm text-sub">{description}</p>}
      {action}
    </div>
  );
}
