import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';
import { AddGoalModal } from '../goals/AddGoalModal';
import { useUiStore } from '../../store/ui';

export function AppShell() {
  const storageError = useUiStore((s) => s.storageError);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      {storageError && (
        <div role="alert" className="flex items-center justify-center gap-2 bg-surface2 px-4 py-2 text-xs text-sub">
          <TriangleAlert size={14} aria-hidden /> Changes can’t be saved in this browser (storage unavailable).
        </div>
      )}
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 pb-32 pt-6 sm:px-8 sm:pt-10">
        <div className="flex-1">
          <Outlet />
        </div>
        <footer className="mt-12 text-center text-xs text-mute">
          Design and Developed by <a href="https://www.linkedin.com/in/radoanmoktakenjaman" target="_blank" rel="noreferrer" className="text-sub hover:text-accent transition-colors">Radoan Jaman</a>
        </footer>
      </main>
      <BottomNavigation />
      <AddGoalModal />
    </div>
  );
}
