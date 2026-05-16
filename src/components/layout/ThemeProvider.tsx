import { useEffect } from 'react';
import { resolveTheme, useThemeStore } from '@/store/theme-store';

/**
 * Applies the user's theme preference to `<html>` via the `dark` class.
 * Listens for OS color-scheme changes when mode === 'system'.
 *
 * Renders no DOM of its own — just side-effects on document.documentElement.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const resolved = resolveTheme(mode);
      root.classList.toggle('dark', resolved === 'dark');
      root.style.colorScheme = resolved;
    };
    apply();

    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [mode]);

  return <>{children}</>;
}
