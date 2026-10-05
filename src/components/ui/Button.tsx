import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'outline' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-bg hover:bg-accent2',
  outline: 'border border-accent/60 text-accent hover:bg-accent/10',
  secondary: 'border border-line bg-surface2 text-ink hover:border-accent/50',
  ghost: 'text-sub hover:text-ink hover:bg-surface2',
};
const sizes: Record<Size, string> = { sm: 'px-4 py-2 text-xs', md: 'px-5 py-3 text-sm' };

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', fullWidth, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    />
  );
});
