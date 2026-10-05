import { create } from 'zustand';
import type { Goal } from '../types';
import type { GoalFormValues } from '../lib/schema';

interface GoalModalState {
  open: boolean;
  /** Prefilled values (popular goal or selected date). */
  prefill?: Partial<GoalFormValues>;
  /** When set, the modal edits this goal instead of creating one. */
  goal?: Goal;
}

interface UiState {
  goalModal: GoalModalState;
  storageError: boolean;
  openGoalModal: (prefill?: Partial<GoalFormValues>) => void;
  openEditGoal: (goal: Goal) => void;
  closeGoalModal: () => void;
  setStorageError: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  goalModal: { open: false },
  storageError: false,
  openGoalModal: (prefill) => set({ goalModal: { open: true, prefill } }),
  openEditGoal: (goal) => set({ goalModal: { open: true, goal } }),
  closeGoalModal: () => set({ goalModal: { open: false } }),
  setStorageError: (storageError) => set({ storageError }),
}));
