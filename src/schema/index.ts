/**
 * Public schema API. Import from `@/schema` everywhere downstream.
 *
 * The schema is the single source of truth for shape. Every state mutation
 * parses through `resume.safeParse(...)` in the store (M3); invalid states
 * are unrepresentable.
 */

export * from './types';
export * from './basics';
export * from './sections';
export * from './resume';
