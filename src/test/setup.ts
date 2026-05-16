import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// React Testing Library cleanup after each test so DOM doesn't leak between tests.
afterEach(() => {
  cleanup();
});

// Minimal matchMedia mock so theme detection doesn't blow up in jsdom.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// In-memory localStorage shim. jsdom's built-in one can misbehave when Zustand's
// persist middleware reads from it before our tests have a chance to seed state.
// Replacing it with a plain object-backed Storage gives us predictable .clear()
// and a fresh slate per test file.
if (typeof window !== 'undefined') {
  const memoryStorage = (): Storage => {
    let store = new Map<string, string>();
    return {
      get length() {
        return store.size;
      },
      clear() {
        store = new Map();
      },
      getItem(key) {
        return store.has(key) ? (store.get(key) as string) : null;
      },
      key(index) {
        return Array.from(store.keys())[index] ?? null;
      },
      removeItem(key) {
        store.delete(key);
      },
      setItem(key, value) {
        store.set(key, String(value));
      },
    };
  };
  Object.defineProperty(window, 'localStorage', { value: memoryStorage(), writable: true });
  Object.defineProperty(window, 'sessionStorage', { value: memoryStorage(), writable: true });
}
