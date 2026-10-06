import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { iconButtonClass } from '../ui/PageHeader';
import { useTracker } from '../../store/tracker';

const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 18) return 'Good afternoon,';
  return 'Good evening,';
};

export function GreetingHeader() {
  const name = useTracker((s) => s.profile.name);
  const avatarUrl = useTracker((s) => s.profile.avatarUrl);
  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar name={name || 'radoan'} src={avatarUrl} className="h-12 w-12 text-sm" />
        <div>
          <p className="text-xs text-sub">{greeting()}</p>
          <h1 className="text-xl font-semibold leading-tight">{name || 'radoan'}</h1>
          <p className="text-xs text-mute">Small steps. Big changes.</p>
        </div>
      </div>
      <Link to="/settings" aria-label="Open settings" className={iconButtonClass}>
        <Settings size={18} />
      </Link>
    </header>
  );
}

