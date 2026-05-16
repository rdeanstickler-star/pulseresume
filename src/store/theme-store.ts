import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI theme preference: light, dark, or follow the OS.
 *
 * The store is the source of truth. A small effect in `ThemeProvider`
 * applies the resolved theme to `<html>` via the `dark` class, and listens
 * for OS-level changes when mode === 'system'.
 *
 * Separate from the resume's `meta.theme` (which is the *resume's* visual
 * theme — colors and fonts inside the rendered document). These two are
 * intentionally decoupled.
 */

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  setMode(mode: ThemeMode): void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode(mode) {
        set({ mode });
      },
    }),
    {
      name: 'pulseresume:theme',
    },
  ),
);

/** Resolve a ThemeMode to a concrete 'light' | 'dark' given the current OS preference. */
export function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') return mode;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
