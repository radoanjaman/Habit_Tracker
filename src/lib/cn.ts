export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export const inputClass =
  'w-full rounded-2xl border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder:text-mute transition-colors duration-200 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';
