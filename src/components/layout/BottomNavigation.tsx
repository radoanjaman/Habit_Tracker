import { NavLink } from 'react-router-dom';
import { CalendarClock, LayoutDashboard, Map, UserRound } from 'lucide-react';
import { cn } from '../../lib/cn';

const ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/history', label: 'History', icon: CalendarClock },
  { to: '/mine', label: 'Mine', icon: UserRound },
];

export function BottomNavigation() {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-full border border-line bg-surface/95 p-1.5 shadow-soft"
    >
      <ul className="grid grid-cols-4 gap-1">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2 text-[11px] font-medium transition-all duration-200 sm:flex-row sm:gap-2 sm:text-sm',
                  isActive ? 'bg-accent font-semibold text-bg' : 'text-mute hover:text-ink',
                )
              }
            >
              <Icon size={18} aria-hidden />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
