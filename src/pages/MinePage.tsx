import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cake, Settings, Target, User, UserRound } from 'lucide-react';
import { PageHeader, iconButtonClass } from '../components/ui/PageHeader';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileField } from '../components/profile/ProfileField';
import { EditFieldModal, type EditableKey, type FieldConfig } from '../components/profile/EditFieldModal';
import { useTracker } from '../store/tracker';
import { fmt, isValidKey } from '../lib/dates';

const FIELDS: Array<FieldConfig & { icon: typeof User }> = [
  { key: 'name', label: 'Name', input: 'text', icon: User },
  { key: 'dateOfBirth', label: 'Date of Birth', input: 'date', icon: Cake },
  { key: 'primaryGoal', label: 'Primary Goal', input: 'text', icon: Target },
];

import { ACHIEVEMENTS } from '../services/achievementDefinitions';
import { AchievementCard } from '../components/achievements/AchievementCard';

export default function MinePage() {
  const profile = useTracker((s) => s.profile);
  const updateProfile = useTracker((s) => s.updateProfile);
  const [editing, setEditing] = useState<FieldConfig | null>(null);

  const display = (f: FieldConfig): string => {
    const v = profile[f.key];
    if (!v) {
      if (f.key === 'name') return 'radoan';
      return '';
    }
    if (f.key === 'dateOfBirth') return isValidKey(String(v)) ? fmt(String(v), 'MMM d, yyyy') : '';
    if (f.suffix) return `${v} ${f.suffix}`;
    return String(v);
  };

  const unlockedIds = new Set(profile.achievementsUnlocked || []);
  const levelXP = 100 + (Math.max(1, profile.level || 1) - 1) * 50; // simple max approximation for current level
  // Actually, we can use a small progress bar. 
  // Wait, our XP is total XP. Let's just show Total XP and Level.

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
        name={profile.name}
        userId={profile.id}
        avatarUrl={profile.avatarUrl}
        onPhotoChange={(url) => updateProfile({ avatarUrl: url })}
        onEdit={() => setEditing(FIELDS[0])}
      />

      <h2 className="mb-3 mt-8 text-sm font-semibold text-sub">Progress</h2>
      <div className="rounded-card border border-line bg-card p-4 shadow-soft">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-lg">Level {profile.level || 1}</span>
          <span className="text-accent font-bold">{profile.xp || 0} XP</span>
        </div>
        <div className="h-3 w-full rounded-full bg-surface2 overflow-hidden">
           <div className="h-full bg-accent transition-all" style={{ width: `${Math.min(100, ((profile.xp || 0) % levelXP) / levelXP * 100)}%` }} />
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold text-sub">Personal Information</h2>
      <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-card shadow-soft">
        {FIELDS.map(({ icon, ...f }) => (
          <ProfileField key={f.key} icon={icon} label={f.label} value={display(f)} onClick={() => setEditing(f)} />
        ))}
      </ul>

      <h2 className="mb-3 mt-8 text-sm font-semibold text-sub">Achievements</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlockedIds.has(ach.id);
          const userAch = isUnlocked 
             ? { ...ach, unlockedAt: profile.achievementsUnlocked?.[profile.achievementsUnlocked.indexOf(ach.id)] } 
             : ach;
          
          return (
            <AchievementCard 
              key={ach.id} 
              achievement={userAch} 
              isUnlocked={isUnlocked} 
            />
          );
        })}
      </div>

      <EditFieldModal
        field={editing}
        profile={profile}
        onClose={() => setEditing(null)}
        onSave={(key: EditableKey, value) => updateProfile({ [key]: value })}
      />
    </div>
  );
}

