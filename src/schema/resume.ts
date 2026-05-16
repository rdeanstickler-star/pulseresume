import { z } from 'zod';
import { basics } from './basics';
import { section } from './sections';

/**
 * Top-level Resume schema. v1 is the launch shape; every doc carries
 * `schemaVersion` so `migrate()` can upgrade older v0 docs we may import
 * (e.g., from rxresu.me or raw JSON Resume).
 */

export const SCHEMA_VERSION = 1 as const;
export type SchemaVersion = typeof SCHEMA_VERSION;

export const meta = z.object({
  /** Template identifier — one of the 6 from M4/M5. */
  template: z
    .enum(['classic', 'modern', 'minimal', 'creative', 'executive', 'technical'])
    .default('classic'),
  /** Page size for PDF export. */
  pageSize: z.enum(['a4', 'letter']).default('a4'),
  /** Theme customization — populated by M6. Always present so M3+ can read defaults. */
  theme: z
    .object({
      primaryColor: z.string().default('#0f172a'),
      accentColor: z.string().default('#22d3ee'),
      background: z.string().default('#ffffff'),
      foreground: z.string().default('#0f172a'),
      sansFont: z.string().default('Inter'),
      serifFont: z.string().default('Merriweather'),
      monoFont: z.string().default('JetBrains Mono'),
      fontSize: z.number().min(8).max(14).default(10),
      lineHeight: z.number().min(1).max(2).default(1.4),
      marginTop: z.number().min(0).max(40).default(16),
      marginBottom: z.number().min(0).max(40).default(16),
      marginLeft: z.number().min(0).max(40).default(16),
      marginRight: z.number().min(0).max(40).default(16),
    })
    .default({
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
    }),
  /** Free-form ISO timestamp of last edit. Useful for sort + diagnostics. */
  updatedAt: z
    .string()
    .datetime({ offset: true })
    .default(() => new Date().toISOString()),
});
export type Meta = z.infer<typeof meta>;

export const resume = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  meta,
  basics,
  /** Ordered list of sections. Empty resumes can have []. */
  sections: z.array(section).default([]),
});

export type Resume = z.infer<typeof resume>;
