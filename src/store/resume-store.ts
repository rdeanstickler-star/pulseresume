import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { migrate, safeValidate } from '../../migrations';
import type { Basics } from '../schema/basics';
import type { Resume } from '../schema/resume';
import type { Meta } from '../schema/resume';
import type { Section, SectionType } from '../schema/sections';
import { SECTION_TYPES } from '../schema/sections';

/**
 * Resume store. Single source of truth for the document on screen.
 *
 * Invariants:
 *  - `resume` is always a valid `Resume` (post-Zod). Mutations that would
 *    produce an invalid state are rejected and surfaced via `lastError`.
 *  - Persistence: serialized JSON in `localStorage` under `pulseresume:v1`.
 *    On hydration we run `migrate()` to upgrade from any older shape.
 *  - All section + item IDs are UUIDv4 (`crypto.randomUUID()`).
 *  - Mutations are functional — every setter accepts a patch and merges.
 *
 * The 120 ms debounce lives in the form layer (`useDebouncedCommit`), not
 * here. The store accepts every mutation immediately; debouncing is purely
 * a typing-experience optimization at the input level.
 */

const STORAGE_KEY = 'pulseresume:v1';

/** Defaults used when there's nothing in localStorage. */
function emptyResume(): Resume {
  return {
    schemaVersion: 1,
    meta: {
      template: 'classic',
      pageSize: 'a4',
      theme: {
        primaryColor: '#0f172a',
        accentColor: '#22d3ee',
        background: '#ffffff',
        foreground: '#0f172a',
        sansFont: 'Inter',
        serifFont: 'Merriweather',
        monoFont: 'JetBrains Mono',
        fontSize: 10,
        lineHeight: 1.4,
        marginTop: 16,
        marginBottom: 16,
        marginLeft: 16,
        marginRight: 16,
      },
      updatedAt: new Date().toISOString(),
    },
    basics: {
      name: '',
      headline: '',
      email: '',
      phone: '',
      url: '',
      photo: { url: '', visible: false },
      summary: '',
      location: { address: '', postalCode: '', city: '', countryCode: '', region: '' },
    },
    sections: [],
  };
}

/** Sensible display name for a freshly-added section. */
function defaultSectionName(type: SectionType): string {
  switch (type) {
    case 'profile':
      return 'Profiles';
    case 'summary':
      return 'Summary';
    case 'experience':
      return 'Experience';
    case 'education':
      return 'Education';
    case 'skills':
      return 'Skills';
    case 'languages':
      return 'Languages';
    case 'awards':
      return 'Awards';
    case 'certifications':
      return 'Certifications';
    case 'publications':
      return 'Publications';
    case 'volunteering':
      return 'Volunteering';
    case 'references':
      return 'References';
    case 'projects':
      return 'Projects';
    case 'interests':
      return 'Interests';
    case 'custom':
      return 'Custom';
  }
}

/** Build an empty section of the given type (no items yet). */
function emptySection(type: SectionType): Section {
  const base = {
    id: cryptoRandomId(),
    name: defaultSectionName(type),
    visible: true,
    columns: 1 as const,
  };
  switch (type) {
    case 'profile':
      return { ...base, type: 'profile', items: [] };
    case 'summary':
      return { ...base, type: 'summary', items: [] };
    case 'experience':
      return { ...base, type: 'experience', items: [] };
    case 'education':
      return { ...base, type: 'education', items: [] };
    case 'skills':
      return { ...base, type: 'skills', items: [] };
    case 'languages':
      return { ...base, type: 'languages', items: [] };
    case 'awards':
      return { ...base, type: 'awards', items: [] };
    case 'certifications':
      return { ...base, type: 'certifications', items: [] };
    case 'publications':
      return { ...base, type: 'publications', items: [] };
    case 'volunteering':
      return { ...base, type: 'volunteering', items: [] };
    case 'references':
      return { ...base, type: 'references', items: [] };
    case 'projects':
      return { ...base, type: 'projects', items: [] };
    case 'interests':
      return { ...base, type: 'interests', items: [] };
    case 'custom':
      return { ...base, type: 'custom', items: [] };
  }
}

/** Safe UUID — falls back to a Math.random-based v4 if crypto.randomUUID is unavailable (legacy browsers, jsdom). */
export function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Minimal v4 shape — for jsdom + ancient browsers only.
  const hex = '0123456789abcdef';
  const r = (n: number) =>
    Array.from({ length: n }, () => hex[Math.floor(Math.random() * 16)]).join('');
  return `${r(8)}-${r(4)}-4${r(3)}-${'89ab'[Math.floor(Math.random() * 4)]}${r(3)}-${r(12)}`;
}

interface ResumeStore {
  resume: Resume;
  /** Most recent validation error from a rejected mutation. Cleared on success. */
  lastError: string | null;
  /** True once the persist hydration completes (mounted from localStorage). */
  hydrated: boolean;

  /** Replace the entire document. Used by Load Example, JSON import. */
  setResume(next: Resume): void;
  /** Replace only basics. */
  setBasics(patch: Partial<Basics>): void;
  /** Replace only meta (template, page size, theme, etc.). */
  setMeta(patch: Partial<Meta>): void;
  /** Append a new empty section of the given type. */
  addSection(type: SectionType): Section;
  /** Remove a section by id. */
  removeSection(id: string): void;
  /** Move a section to a new index in the sections array. */
  moveSection(id: string, toIndex: number): void;
  /** Patch a single section's top-level fields (name, visible, columns). */
  updateSection(id: string, patch: Partial<Pick<Section, 'name' | 'visible' | 'columns'>>): void;
  /** Reset to a blank resume. */
  reset(): void;
}

/**
 * Run a candidate next-state through Zod. Returns the validated doc on
 * success, or sets `lastError` and returns null on failure. Used by every
 * mutation.
 */
function commit(candidate: Resume, set: (s: Partial<ResumeStore>) => void): Resume | null {
  const result = safeValidate(candidate);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const msg = firstIssue
      ? `${firstIssue.path.join('.') || '(root)'}: ${firstIssue.message}`
      : 'Unknown validation error';
    set({ lastError: msg });
    return null;
  }
  // Touch updatedAt on every successful mutation.
  const next = {
    ...result.data,
    meta: { ...result.data.meta, updatedAt: new Date().toISOString() },
  };
  set({ resume: next, lastError: null });
  return next;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resume: emptyResume(),
      lastError: null,
      hydrated: false,

      setResume(next) {
        commit(next, set);
      },

      setBasics(patch) {
        const r = get().resume;
        commit({ ...r, basics: { ...r.basics, ...patch } }, set);
      },

      setMeta(patch) {
        const r = get().resume;
        commit({ ...r, meta: { ...r.meta, ...patch } }, set);
      },

      addSection(type) {
        const r = get().resume;
        const newSection = emptySection(type);
        commit({ ...r, sections: [...r.sections, newSection] }, set);
        return newSection;
      },

      removeSection(id) {
        const r = get().resume;
        commit({ ...r, sections: r.sections.filter((s) => s.id !== id) }, set);
      },

      moveSection(id, toIndex) {
        const r = get().resume;
        const fromIndex = r.sections.findIndex((s) => s.id === id);
        if (fromIndex === -1) return;
        const target = Math.max(0, Math.min(toIndex, r.sections.length - 1));
        if (target === fromIndex) return;
        const next = [...r.sections];
        const moved = next.splice(fromIndex, 1)[0];
        if (!moved) return;
        next.splice(target, 0, moved);
        commit({ ...r, sections: next }, set);
      },

      updateSection(id, patch) {
        const r = get().resume;
        commit(
          {
            ...r,
            sections: r.sections.map((s) => (s.id === id ? ({ ...s, ...patch } as Section) : s)),
          },
          set,
        );
      },

      reset() {
        commit(emptyResume(), set);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Persist only the document, not transient state.
      partialize: (state) => ({ resume: state.resume }),
      // On hydrate, run any pending migration so an older doc lifts to v1.
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('PulseResume: hydration failed', error);
          return;
        }
        if (state) {
          try {
            // The persisted shape is `{ resume }`. Migrate the resume.
            const migrated = migrate(state.resume);
            state.resume = migrated;
          } catch (migrateError) {
            console.warn(
              'PulseResume: migration failed on hydrate — starting fresh.',
              migrateError,
            );
            state.resume = emptyResume();
          } finally {
            state.hydrated = true;
          }
        }
      },
    },
  ),
);

/** Convenience: list of all section types for "Add Section" UI. */
export { SECTION_TYPES };
export { defaultSectionName };
