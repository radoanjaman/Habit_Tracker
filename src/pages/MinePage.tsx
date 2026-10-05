import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cake, Mail, Ruler, Scale, Settings, Target, User, UserRound, Users } from 'lucide-react';
import { PageHeader, iconButtonClass } from '../components/ui/PageHeader';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileField } from '../components/profile/ProfileField';
import { EditFieldModal, type EditableKey, type FieldConfig } from '../components/profile/EditFieldModal';
import { useTracker } from '../store/tracker';
import { fmt, isValidKey } from '../lib/dates';

const FIELDS: Array<FieldConfig & { icon: typeof User }> = [
  { key: 'fullName', label: 'Full Name', input: 'text', icon: User },
  { key: 'email', label: 'Email', input: 'email', icon: Mail },
  { key: 'dateOfBirth', label: 'Date of Birth', input: 'date', icon: Cake },
  { key: 'gender', label: 'Gender', input: 'select', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'], icon: Users },
  { key: 'heightCm', label: 'Height', input: 'number', suffix: 'cm', icon: Ruler },
  { key: 'weightKg', label: 'Weight', input: 'number', suffix: 'kg', icon: Scale },
  { key: 'mainGoal', label: 'Main Goal', input: 'text', icon: Target },
];

export default function MinePage() {
  const profile = useTracker((s) => s.profile);
  const updateProfile = useTracker((s) => s.updateProfile);
  const [editing, setEditing] = useState<FieldConfig | null>(null);

  const display = (f: FieldConfig): string => {
    const v = profile[f.key];
    if (!v) {
      if (f.key === 'fullName') return 'radoan';
      if (f.key === 'email') return 'radoan.jaman@example.com';
      return '';
    }
    if (f.key === 'dateOfBirth') return isValidKey(String(v)) ? fmt(String(v), 'MMM d, yyyy') : '';
    if (f.suffix) return `${v} ${f.suffix}`;
    return String(v);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Mine"
        left={<UserRound size={22} className="text-accent" aria-hidden />}
        right={
          <Link to="/settings" aria-label="Open settings" className={iconButtonClass}>
            <Settings size={18} />
          </Link>
        }
      />
      <ProfileHeader
        name={profile.fullName}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
        onPhotoChange={(url) => updateProfile({ avatarUrl: url })}
        onEdit={() => setEditing(FIELDS[0])}
      />

      <h2 className="mb-3 mt-8 text-sm font-semibold text-sub">Personal Information</h2>
      <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-card shadow-soft">
        {FIELDS.map(({ icon, ...f }) => (
          <ProfileField key={f.key} icon={icon} label={f.label} value={display(f)} onClick={() => setEditing(f)} />
        ))}
      </ul>

      <EditFieldModal
        field={editing}
        profile={profile}
        onClose={() => setEditing(null)}
        onSave={(key: EditableKey, value) => updateProfile({ [key]: value })}
      />
    </div>
  );
}

