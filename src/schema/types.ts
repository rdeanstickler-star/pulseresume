import { z } from 'zod';

/**
 * Shared primitives for the resume schema.
 *
 * Design notes:
 * - Dates are ISO 8601 strings (`YYYY-MM-DD` or `YYYY-MM` or `YYYY`). We accept
 *   permissive granularity because resumes don't always know the day.
 * - URLs use Zod's built-in URL validator; emails likewise.
 * - RichText is currently a sanitized HTML string. The Tiptap editor in M3
 *   serializes to HTML on write. When we need lossless round-trip (e.g., for
 *   complex tables or images), we'll widen to a discriminated union that also
 *   accepts Tiptap JSON; the migration is one-line.
 * - IDs are UUIDv4 strings produced by `crypto.randomUUID()` in the browser.
 */

/** YYYY, YYYY-MM, or YYYY-MM-DD. Permissive partial-date support. */
export const dateString = z
  .string()
  .regex(
    /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/,
    'Expected YYYY, YYYY-MM, or YYYY-MM-DD',
  );

export type DateString = z.infer<typeof dateString>;

/** Lenient URL — allows empty string for "I'll fill this in later" UX. */
export const urlString = z.union([z.literal(''), z.string().url('Expected a valid URL')]);
export type URLString = z.infer<typeof urlString>;

/** Lenient email — allows empty for partial drafts. */
export const emailString = z.union([z.literal(''), z.string().email('Expected a valid email')]);
export type EmailString = z.infer<typeof emailString>;

/**
 * Rich text content. Stored as sanitized HTML produced by Tiptap.
 *
 * Why HTML and not Markdown:
 * - Tiptap's source-of-truth is its document JSON, but HTML is the canonical
 *   serialization for "give me back text I can paste into a PDF / render in
 *   another tool". Storing HTML keeps the schema portable.
 * - Sanitization is enforced at write time in the editor (M3), not at the
 *   schema layer. The schema just types it as a string.
 *
 * Future: when complex content (images, tables, code blocks) needs lossless
 * round-trip, widen to `z.union([z.string(), z.object({ json: z.unknown() })])`
 * and bump the schema version with a migration. The plumbing exists.
 */
export const richText = z.string();
export type RichText = z.infer<typeof richText>;

/** UUIDv4 from `crypto.randomUUID()`. Required on every section + item. */
export const id = z.string().uuid('Expected a UUIDv4');
export type Id = z.infer<typeof id>;

/** Visibility flag — sections and items can be hidden without deletion. */
export const visible = z.boolean().default(true);

/** Column layout per section. 1 = full width, 2 = half (side-by-side). */
export const columns = z.union([z.literal(1), z.literal(2)]).default(1);
export type Columns = z.infer<typeof columns>;

/** Skill / language proficiency levels. Optional everywhere. */
export const skillLevel = z.enum(['novice', 'beginner', 'intermediate', 'advanced', 'expert']);
export type SkillLevel = z.infer<typeof skillLevel>;

export const languageFluency = z.enum([
  'elementary',
  'limited',
  'professional',
  'fluent',
  'native',
]);
export type LanguageFluency = z.infer<typeof languageFluency>;
