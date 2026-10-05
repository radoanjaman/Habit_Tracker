import type { StateStorage } from 'zustand/middleware';
import { useUiStore } from '../store/ui';

/**
 * localStorage adapter that never throws. This is the single seam to swap
 * for a remote backend (e.g. Supabase) later: implement StateStorage (or replace
 * the persist layer) without touching UI code.
 */
export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      const raw = localStorage.getItem(name);
      if (raw) JSON.parse(raw); // validate: corrupted JSON is discarded
      return raw;
    } catch {
      console.warn('Corrupted or unavailable saved data; starting fresh.');
      try {
        localStorage.removeItem(name);
      } catch {
        /* storage unavailable */
      }
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
      if (useUiStore.getState().storageError) useUiStore.getState().setStorageError(false);
    } catch {
      useUiStore.getState().setStorageError(true);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
