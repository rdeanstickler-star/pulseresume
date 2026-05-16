import type { Migration } from './types';

/**
 * v0 → v1 (bootstrap migration).
 *
 * v0 represents "documents with no schemaVersion field" — typically
 * JSON-Resume-shaped imports, hand-written resumes, or pre-launch drafts.
 *
 * Strategy: if a document arrives without `schemaVersion`, we treat it as v0
 * and stamp it as v1 here. The full JSON-Resume → PulseResume restructure
 * (walking `work`, `education`, etc. into `sections[]`) lands in M8 when
 * import goes live. For now, v0 → v1 is a defensive pass: any document
 * that doesn't declare a version gets `schemaVersion: 1` so the parser
 * can take it from there. The Zod validator downstream will reject any
 * doc that doesn't actually fit the v1 shape.
 *
 * Why ship this as v0→v1 today instead of "later":
 * - Keeps `migrate()` chain plumbing honest from day one.
 * - Forces the migration test suite to exist before there's pressure to
 *   skip it.
 * - When M8 adds the real JSON-Resume transform, it slots into this exact
 *   place — no churn to the chain logic.
 */
export const v0ToV1: Migration<{ schemaVersion?: unknown; [k: string]: unknown }, unknown> = {
  from: 0,
  to: 1,
  description: 'Bootstrap migration: stamp schemaVersion on un-versioned documents.',
  migrate(data) {
    if (data === null || typeof data !== 'object') {
      throw new TypeError('v0→v1 expected an object, got ' + typeof data);
    }
    return { ...data, schemaVersion: 1 };
  },
};
