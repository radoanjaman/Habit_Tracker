import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalFormSchema, type GoalFormValues } from '../../lib/schema';
import { GOAL_CATEGORIES } from '../../types';
import { GOAL_ICONS } from '../../lib/icons';
import { Button } from '../ui/Button';
import { cn, inputClass } from '../../lib/cn';
import { useEffect } from 'react';

const WEEKDAY_CHIPS = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
];

const FREQUENCIES = [
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'days', label: 'Specific days' },
  { value: 'once', label: 'One day only' },
] as const;

const PRESETS = [
  { label: 'Every Monday', days: [1] },
  { label: '3 days / week', days: [1, 3, 5] },
  { label: 'Weekends', days: [6, 0] },
];

const Choice = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { children: ReactNode; round?: boolean }>(
  function Choice({ children, round, ...props }, ref) {
    return (
      <label className="cursor-pointer">
        <input ref={ref} className="peer sr-only" {...props} />
        <span
          className={cn(
            'flex items-center justify-center gap-1.5 border border-line text-sm text-sub transition-colors duration-200 hover:border-accent/50 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-bg peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface',
            round ? 'h-10 w-10 rounded-full' : 'rounded-full px-3.5 py-2',
          )}
        >
          {children}
        </span>
      </label>
    );
  },
);

function Field({ label, error, children, htmlFor }: { label: string; error?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

interface Props {
  defaultValues: GoalFormValues;
  submitLabel: string;
  onSubmit: (values: GoalFormValues) => void;
  onCancel: () => void;
  onDirtyChange: (dirty: boolean) => void;
}

export function GoalForm({ defaultValues, submitLabel, onSubmit, onCancel, onDirtyChange }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<GoalFormValues>({ resolver: zodResolver(goalFormSchema), defaultValues });

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const frequencyType = watch('frequencyType');
  const days = watch('days');
  const setDays = (next: number[]) => setValue('days', next, { shouldDirty: true, shouldValidate: true });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field label="Goal Title" htmlFor="goal-title" error={errors.title?.message}>
        <input id="goal-title" className={inputClass} placeholder="e.g. Read 20 pages" autoFocus {...register('title')} />
      </Field>

      <Field label="Description (optional)" htmlFor="goal-desc" error={errors.description?.message}>
        <textarea id="goal-desc" rows={2} className={cn(inputClass, 'resize-none')} {...register('description')} />
      </Field>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Category</legend>
        <div className="flex flex-wrap gap-2">
          {GOAL_CATEGORIES.map((c) => (
            <Choice key={c} type="radio" value={c} {...register('category')}>
              {c}
            </Choice>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Target frequency</legend>
        <div className="flex flex-wrap gap-2">
          {FREQUENCIES.map((f) => (
            <Choice key={f.value} type="radio" value={f.value} {...register('frequencyType')}>
              {f.label}
            </Choice>
          ))}
        </div>
        {frequencyType === 'days' && (
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Days of the week">
              {WEEKDAY_CHIPS.map((d) => {
                const active = days.includes(d.value);
                return (
                  <button
                    key={d.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setDays(active ? days.filter((x) => x !== d.value) : [...days, d.value])}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200',
                      active ? 'border-accent bg-accent text-bg' : 'border-line text-sub hover:border-accent/50',
                    )}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setDays(p.days)}
                  className="rounded-full bg-surface2 px-3 py-1 text-xs text-sub transition-colors hover:text-ink"
                >
                  {p.label}
                </button>
              ))}
            </div>
            {errors.days?.message && (
              <p role="alert" className="text-xs text-accent">
                {errors.days.message}
              </p>
            )}
          </div>
        )}
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Start date" htmlFor="goal-start" error={errors.startDate?.message}>
          <input id="goal-start" type="date" className={inputClass} {...register('startDate')} />
        </Field>
        <Field label="End date (optional)" htmlFor="goal-end" error={errors.endDate?.message}>
          <input id="goal-end" type="date" className={inputClass} {...register('endDate')} />
        </Field>
      </div>

      <Field label="Reminder (optional)" htmlFor="goal-reminder" error={errors.reminderTime?.message}>
        <input id="goal-reminder" type="time" className={inputClass} {...register('reminderTime')} />
      </Field>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Icon</legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(GOAL_ICONS).map(([key, { icon: Icon, label }]) => (
            <Choice key={key} type="radio" value={key} round aria-label={label} {...register('icon')}>
              <Icon size={18} aria-hidden />
            </Choice>
          ))}
        </div>
      </fieldset>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
