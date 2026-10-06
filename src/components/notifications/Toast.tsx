import { CheckCircle2, Trophy, X } from 'lucide-react';
import { ToastMessage, useUiStore } from '../../store/ui';
import { cn } from '../../lib/cn';
import { useEffect, useState } from 'react';

export function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts);
  
  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none transition-all duration-300 bottom-[96px] sm:bottom-[32px] w-[calc(100%-32px)] sm:w-max max-w-[420px] min-w-[300px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function Toast({ toast }: { toast: ToastMessage }) {
  const hideToast = useUiStore((s) => s.hideToast);
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // trigger enter animation
    const t = requestAnimationFrame(() => setMounted(true));
    
    // trigger exit animation slightly before removal (3000ms total, exit at 2700ms)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2700);
    
    return () => {
      cancelAnimationFrame(t);
      clearTimeout(exitTimer);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => hideToast(toast.id), 250);
  };

  const isGoal = toast.type === 'goal-completed';

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center justify-between gap-3 p-[14px_18px] rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-black/10 transition-all duration-250 ease-out",
        isGoal ? "bg-[#E8FF3D] text-[#090C05]" : "bg-[#B5CC18] text-[#090C05]",
        mounted && !isExiting ? "opacity-100 translate-y-0 scale-100" : (isExiting ? "opacity-0 translate-y-2 scale-100" : "opacity-0 translate-y-3 scale-95")
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 flex items-center justify-center">
          {isGoal ? <CheckCircle2 size={24} color="#090C05" /> : <Trophy size={24} color="#090C05" />}
        </div>
        
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-[14px] sm:text-[16px] leading-tight text-[#090C05]">
            {toast.title}
          </span>
          <span className="font-medium text-[13px] sm:text-[14px] leading-tight text-[#090C05]/80 truncate">
            {toast.message}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        {toast.xp && (
          <span className="font-bold text-[14px] text-[#090C05]">
            +{toast.xp} XP
          </span>
        )}
        <button 
          onClick={handleClose}
          className="hidden sm:flex items-center justify-center p-1 rounded-full hover:bg-black/10 transition-colors shrink-0"
          aria-label="Close notification"
        >
          <X size={16} color="#090C05" />
        </button>
      </div>
    </div>
  );
}
