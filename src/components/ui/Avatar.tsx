import { cn } from '../../lib/cn';

interface Props {
  name: string;
  src?: string;
  className?: string;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '?';

export function Avatar({ name, src, className }: Props) {
  if (src) {
    return (
      <img
        src={src}
        alt={`Avatar of ${name}`}
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full border-2 border-accent/70 object-cover',
          className ?? 'h-12 w-12'
        )}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`Avatar of ${name}`}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border-2 border-accent/70 bg-surface2 font-semibold text-accent',
        className ?? 'h-12 w-12 text-sm',
      )}
    >
      {initials(name)}
    </div>
  );
}
