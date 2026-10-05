import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Props {
  percent: number;
  className?: string;
  strokeWidth?: number;
  children?: ReactNode;
  label: string;
}

const SIZE = 100;

/**
 * Thick ring made of two rounded arcs (progress + remaining track) separated by
 * small gaps, starting at 12 o'clock and running clockwise.
 */
export function ProgressRing({ percent, className, strokeWidth = 13, children, label }: Props) {
  const p = Math.max(0, Math.min(100, percent));
  const r = (SIZE - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const progressLen = (c * p) / 100;
  // Round caps extend by strokeWidth/2 at each end, so shorten segments to leave a visible gap.
  const gap = strokeWidth * 1.5;

  const hasProgress = p > 0;
  const hasTrack = p < 100;
  const progressDash = p === 100 ? c : Math.max(progressLen - gap, 0.01);
  const progressOffset = p === 100 ? 0 : -gap / 2;
  const trackDash = p === 0 ? c : Math.max(c - progressLen - gap, 0.01);
  const trackOffset = p === 0 ? 0 : -(progressLen + gap / 2);

  const common = { cx: SIZE / 2, cy: SIZE / 2, r, fill: 'none', strokeWidth, strokeLinecap: 'round' as const };

  return (
    <div className={cn('relative', className ?? 'h-44 w-44')} role="img" aria-label={`${label}: ${p}%`}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90">
        {hasTrack && (
          <circle
            {...common}
            strokeDasharray={`${trackDash} ${c}`}
            strokeDashoffset={trackOffset}
            className="stroke-[#3A3D2C] transition-all duration-700 ease-out"
          />
        )}
        {hasProgress && (
          <circle
            {...common}
            strokeDasharray={`${progressDash} ${c}`}
            strokeDashoffset={progressOffset}
            className="stroke-accent transition-all duration-700 ease-out"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}
