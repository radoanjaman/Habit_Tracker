import type { ReactNode } from 'react';

interface Props {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
}

export function PageHeader({ title, left, right }: Props) {
  return (
    <header className="mb-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {left}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      {right}
    </header>
  );
}

export const iconButtonClass =
  'flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-sub transition-colors duration-200 hover:border-accent/50 hover:text-ink';
