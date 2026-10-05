import type { ReactNode } from 'react';

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-sub">{title}</h2>
      <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-card shadow-soft">{children}</ul>
    </section>
  );
}
