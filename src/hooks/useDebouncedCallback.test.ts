import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebouncedCallback } from './useDebouncedCallback';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays invocation until wait ms after the last call', () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(cb, 100));

    act(() => result.current('a'));
    act(() => vi.advanceTimersByTime(50));
    act(() => result.current('b'));
    act(() => vi.advanceTimersByTime(50));
    expect(cb).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(60));
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('b');
  });

  it('uses the latest callback (no stale closure)', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(({ cb }) => useDebouncedCallback(cb, 100), {
      initialProps: { cb: first },
    });

    act(() => result.current('x'));
    rerender({ cb: second });
    act(() => vi.advanceTimersByTime(150));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledWith('x');
  });

  it('clears pending timer on unmount (no late firing)', () => {
    const cb = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(cb, 100));

    act(() => result.current('value'));
    unmount();
    act(() => vi.advanceTimersByTime(200));

    expect(cb).not.toHaveBeenCalled();
  });

  it('defaults wait to 120 ms', () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(cb));

    act(() => result.current('x'));
    act(() => vi.advanceTimersByTime(119));
    expect(cb).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2));
    expect(cb).toHaveBeenCalledWith('x');
  });

  it('the returned function identity is stable across renders', () => {
    const cb = vi.fn();
    const { result, rerender } = renderHook(({ c }) => useDebouncedCallback(c, 100), {
      initialProps: { c: cb },
    });
    const first = result.current;
    rerender({ c: cb });
    expect(result.current).toBe(first);
  });
});
