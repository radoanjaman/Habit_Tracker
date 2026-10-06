import { cn } from '../../lib/cn';

import { getAvatarColor, getInitials } from '../../lib/avatar';

interface Props {
  name: string;
  userId?: string;
  src?: string;
  className?: string;
}

export function Avatar({ name, userId, src, className }: Props) {
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

  const bgColor = userId ? getAvatarColor(userId) : 'bg-surface2';
  const textColor = userId ? 'text-white' : 'text-accent';

  return (
    <div
      role="img"
      aria-label={`Avatar of ${name}`}
      className={cn(
        `flex shrink-0 items-center justify-center rounded-full border-2 border-accent/70 font-semibold ${bgColor} ${textColor}`,
        className ?? 'h-12 w-12 text-sm',
      )}
    >
      {getInitials(name)}
    </div>
  );
}
