import { z } from 'zod';
import { emailString, urlString } from './types';

/**
 * Top-level identity block. Always present, always visible, not a section
 * (sections are reorderable; basics is fixed at the top of the resume).
 *
 * Aligns with the JSON Resume `basics` block where possible. Deviations
 * documented in `JSON_RESUME_ALIGNMENT.md`.
 */
export const location = z.object({
  /** Free-form line, e.g., "123 Main St". Optional. */
  address: z.string().default(''),
  postalCode: z.string().default(''),
  city: z.string().default(''),
  /** ISO 3166-1 alpha-2 country code, e.g., "US". Free-form OK. */
  countryCode: z.string().default(''),
  /** State / province / region. */
  region: z.string().default(''),
});
export type Location = z.infer<typeof location>;

export const basics = z.object({
  /** Display name. Required for the resume to be useful. */
  name: z.string().default(''),
  /** Headline / job title shown under the name. */
  headline: z.string().default(''),
  email: emailString.default(''),
  /** Free-form phone — international formats vary too much for strict validation. */
  phone: z.string().default(''),
  /** Personal site / portfolio. */
  url: urlString.default(''),
  /** Optional photo URL (data URI or remote). Hidden by default for ATS resumes. */
  photo: z
    .object({
      url: urlString,
      visible: z.boolean().default(false),
    })
    .default({ url: '', visible: false }),
  /** Professional summary line(s) shown in the header (NOT the "summary" section, which is separate). */
  summary: z.string().default(''),
  location: location.default({
    address: '',
    postalCode: '',
    city: '',
    countryCode: '',
    region: '',
  }),
});

export type Basics = z.infer<typeof basics>;
