import { create } from 'zustand';
import type { Goal } from '../types';
import type { GoalFormValues } from '../lib/schema';

export type ToastType = 'goal-completed' | 'achievement';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  xp?: number;
}

interface GoalModalState {
  open: boolean;
  prefill?: Partial<GoalFormValues>;
  goal?: Goal;
}

interface UiState {
  goalModal: GoalModalState;
  storageError: boolean;
  toasts: ToastMessage[];
  openGoalModal: (prefill?: Partial<GoalFormValues>) => void;
  openEditGoal: (goal: Goal) => void;
  closeGoalModal: () => void;
  setStorageError: (v: boolean) => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  hideToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  goalModal: { open: false },
  storageError: false,
  toasts: [],
  openGoalModal: (prefill) => set({ goalModal: { open: true, prefill } }),
  openEditGoal: (goal) => set({ goalModal: { open: true, goal } }),
  closeGoalModal: () => set({ goalModal: { open: false } }),
  setStorageError: (storageError) => set({ storageError }),
  showToast: (toastInput) => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast = { ...toastInput, id };
    set((s) => ({ toasts: [...s.toasts, newToast] }));
    
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  hideToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
