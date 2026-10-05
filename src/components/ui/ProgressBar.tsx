interface Props {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: Props) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-surface2"
    >
      <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${v}%` }} />
    </div>
  );
}
