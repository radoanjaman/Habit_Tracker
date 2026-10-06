import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { inputClass } from '../../lib/cn';
import { profileSchemas } from '../../lib/schema';
import type { UserProfile } from '../../types';

export type EditableKey = keyof typeof profileSchemas;

export interface FieldConfig {
  key: EditableKey;
  label: string;
  input: 'text' | 'email' | 'date' | 'number' | 'select';
  options?: string[];
  suffix?: string;
}

interface Props {
  field: FieldConfig | null;
  profile: UserProfile;
  onSave: (key: EditableKey, value: string | number) => void;
  onClose: () => void;
}

export function EditFieldModal({ field, profile, onSave, onClose }: Props) {
  return (
    <Modal open={!!field} title={field ? `Edit ${field.label}` : ''} onClose={onClose}>
      {field && <FieldForm key={field.key} field={field} profile={profile} onSave={onSave} onClose={onClose} />}
    </Modal>
  );
}

function FieldForm({ field, profile, onSave, onClose }: Props & { field: FieldConfig }) {
  const schema = z.object({ value: profileSchemas[field.key] });
  const { register, handleSubmit, formState: { errors } } = useForm<{ value: string | number }>({
    resolver: zodResolver(schema),
    defaultValues: { value: profile[field.key] || '' },
  });
  const id = `field-${field.key}`;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(({ value }) => {
        onSave(field.key, typeof value === 'string' ? value.trim() : value);
        onClose();
      })}
      className="space-y-5"
    >
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
          {field.label} {field.suffix && <span className="text-sub">({field.suffix})</span>}
        </label>
        {field.input === 'select' ? (
          <select id={id} className={inputClass} {...register('value')}>
            <option value="">Select…</option>
            {field.options?.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input 
            id={id} 
            type={field.input} 
            step="any" 
            autoFocus 
            className={inputClass} 
            placeholder={
              field.key === 'name' ? 'radoan' : 
              ''
            }
            {...register('value')} 
          />
        )}
        {errors.value?.message && (
          <p role="alert" className="mt-1.5 text-xs text-accent">
            {String(errors.value.message)}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" fullWidth>
          Save
        </Button>
      </div>
    </form>
  );
}
