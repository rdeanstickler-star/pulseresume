import { describe, expect, it, beforeEach, vi } from 'vitest';
import { useThemeStore, resolveTheme } from './theme-store';

describe('theme store', () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({ mode: 'system' });
  });

  it('defaults to system mode', () => {
    expect(useThemeStore.getState().mode).toBe('system');
  });

  it('setMode updates and is observable via getState', () => {
    useThemeStore.getState().setMode('dark');
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  it('accepts all three modes', () => {
    const modes = ['light', 'dark', 'system'] as const;
    for (const mode of modes) {
      useThemeStore.getState().setMode(mode);
      expect(useThemeStore.getState().mode).toBe(mode);
    }
  });
});

describe('resolveTheme', () => {
  it('returns the literal mode for non-system values', () => {
    expect(resolveTheme('light')).toBe('light');
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('returns dark when matchMedia reports dark preference', () => {
    const spy = vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    } as unknown as MediaQueryList);
    expect(resolveTheme('system')).toBe('dark');
    spy.mockRestore();
  });

  it('returns light when matchMedia reports light preference', () => {
    const spy = vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    } as unknown as MediaQueryList);
    expect(resolveTheme('system')).toBe('light');
    spy.mockRestore();
  });
});
