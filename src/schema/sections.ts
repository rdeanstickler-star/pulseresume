import { z } from 'zod';
import {
  columns,
  dateString,
  id,
  languageFluency,
  richText,
  skillLevel,
  urlString,
  visible,
} from './types';

/**
 * Section + item schemas. Every section is a discriminated union member
 * keyed by `type`. Every item is owned by exactly one section and has its
 * own UUID.
 *
 * Design invariants:
 * - All optional fields default to empty (string, array, etc.) so the editor
 *   never has to deal with `undefined` mid-form.
 * - `visible` defaults to true on sections and items; the editor toggles it.
 * - Items carry an `id` so dnd-kit can stably re-order them.
 */

// ============================================================================
//  Item shapes
// ============================================================================

export const profileItem = z.object({
  id,
  /** e.g., "LinkedIn", "GitHub", "Twitter", "Mastodon" */
  network: z.string().default(''),
  username: z.string().default(''),
  url: urlString.default(''),
  /** lucide-react icon name, optional. Resolved at render time. */
  icon: z.string().default(''),
  visible,
});
export type ProfileItem = z.infer<typeof profileItem>;

export const experienceItem = z.object({
  id,
  company: z.string().default(''),
  position: z.string().default(''),
  location: z.string().default(''),
  startDate: dateString.optional().or(z.literal('')).default(''),
  endDate: dateString.optional().or(z.literal('')).default(''),
  /** When true, endDate is ignored and "Present" is rendered. */
  current: z.boolean().default(false),
  url: urlString.default(''),
  summary: richText.default(''),
  highlights: z.array(z.string()).default([]),
  visible,
});
export type ExperienceItem = z.infer<typeof experienceItem>;

export const educationItem = z.object({
  id,
  institution: z.string().default(''),
  area: z.string().default(''),
  studyType: z.string().default(''),
  startDate: dateString.optional().or(z.literal('')).default(''),
  endDate: dateString.optional().or(z.literal('')).default(''),
  current: z.boolean().default(false),
  score: z.string().default(''),
  url: urlString.default(''),
  courses: z.array(z.string()).default([]),
  summary: richText.default(''),
  visible,
});
export type EducationItem = z.infer<typeof educationItem>;

export const skillItem = z.object({
  id,
  name: z.string().default(''),
  level: skillLevel.optional(),
  keywords: z.array(z.string()).default([]),
  visible,
});
export type SkillItem = z.infer<typeof skillItem>;

export const languageItem = z.object({
  id,
  language: z.string().default(''),
  fluency: languageFluency.optional(),
  visible,
});
export type LanguageItem = z.infer<typeof languageItem>;

export const awardItem = z.object({
  id,
  title: z.string().default(''),
  date: dateString.optional().or(z.literal('')).default(''),
  awarder: z.string().default(''),
  url: urlString.default(''),
  summary: richText.default(''),
  visible,
});
export type AwardItem = z.infer<typeof awardItem>;

export const certificationItem = z.object({
  id,
  name: z.string().default(''),
  date: dateString.optional().or(z.literal('')).default(''),
  issuer: z.string().default(''),
  url: urlString.default(''),
  summary: richText.default(''),
  visible,
});
export type CertificationItem = z.infer<typeof certificationItem>;

export const publicationItem = z.object({
  id,
  name: z.string().default(''),
  publisher: z.string().default(''),
  releaseDate: dateString.optional().or(z.literal('')).default(''),
  url: urlString.default(''),
  summary: richText.default(''),
  visible,
});
export type PublicationItem = z.infer<typeof publicationItem>;

export const volunteeringItem = z.object({
  id,
  organization: z.string().default(''),
  position: z.string().default(''),
  location: z.string().default(''),
  startDate: dateString.optional().or(z.literal('')).default(''),
  endDate: dateString.optional().or(z.literal('')).default(''),
  current: z.boolean().default(false),
  url: urlString.default(''),
  summary: richText.default(''),
  highlights: z.array(z.string()).default([]),
  visible,
});
export type VolunteeringItem = z.infer<typeof volunteeringItem>;

export const referenceItem = z.object({
  id,
  name: z.string().default(''),
  /** "Director of Engineering at Acme Co." */
  position: z.string().default(''),
  contact: z.string().default(''),
  reference: richText.default(''),
  visible,
});
export type ReferenceItem = z.infer<typeof referenceItem>;

export const projectItem = z.object({
  id,
  name: z.string().default(''),
  description: richText.default(''),
  url: urlString.default(''),
  startDate: dateString.optional().or(z.literal('')).default(''),
  endDate: dateString.optional().or(z.literal('')).default(''),
  current: z.boolean().default(false),
  role: z.string().default(''),
  keywords: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  visible,
});
export type ProjectItem = z.infer<typeof projectItem>;

export const interestItem = z.object({
  id,
  name: z.string().default(''),
  keywords: z.array(z.string()).default([]),
  visible,
});
export type InterestItem = z.infer<typeof interestItem>;

/** Custom section item — most flexible. Used for hobbies, awards lists, anything. */
export const customItem = z.object({
  id,
  title: z.string().default(''),
  subtitle: z.string().default(''),
  date: dateString.optional().or(z.literal('')).default(''),
  location: z.string().default(''),
  url: urlString.default(''),
  summary: richText.default(''),
  keywords: z.array(z.string()).default([]),
  visible,
});
export type CustomItem = z.infer<typeof customItem>;

// ============================================================================
//  Section base — common to every section
// ============================================================================

const sectionBase = z.object({
  id,
  /** User-editable display name, e.g., "Work Experience" or "Career". */
  name: z.string(),
  visible,
  columns,
});

// ============================================================================
//  Section schemas (discriminated union members)
// ============================================================================

export const profileSection = sectionBase.extend({
  type: z.literal('profile'),
  items: z.array(profileItem).default([]),
});

/**
 * Summary section — a single rich-text block, not a list. We still wrap it in
 * `items` (length 1) for layout consistency with all other sections.
 */
export const summarySection = sectionBase.extend({
  type: z.literal('summary'),
  items: z
    .array(
      z.object({
        id,
        content: richText.default(''),
        visible,
      }),
    )
    .max(1)
    .default([]),
});

export const experienceSection = sectionBase.extend({
  type: z.literal('experience'),
  items: z.array(experienceItem).default([]),
});

export const educationSection = sectionBase.extend({
  type: z.literal('education'),
  items: z.array(educationItem).default([]),
});

export const skillsSection = sectionBase.extend({
  type: z.literal('skills'),
  items: z.array(skillItem).default([]),
});

export const languagesSection = sectionBase.extend({
  type: z.literal('languages'),
  items: z.array(languageItem).default([]),
});

export const awardsSection = sectionBase.extend({
  type: z.literal('awards'),
  items: z.array(awardItem).default([]),
});

export const certificationsSection = sectionBase.extend({
  type: z.literal('certifications'),
  items: z.array(certificationItem).default([]),
});

export const publicationsSection = sectionBase.extend({
  type: z.literal('publications'),
  items: z.array(publicationItem).default([]),
});

export const volunteeringSection = sectionBase.extend({
  type: z.literal('volunteering'),
  items: z.array(volunteeringItem).default([]),
});

export const referencesSection = sectionBase.extend({
  type: z.literal('references'),
  items: z.array(referenceItem).default([]),
});

export const projectsSection = sectionBase.extend({
  type: z.literal('projects'),
  items: z.array(projectItem).default([]),
});

export const interestsSection = sectionBase.extend({
  type: z.literal('interests'),
  items: z.array(interestItem).default([]),
});

export const customSection = sectionBase.extend({
  type: z.literal('custom'),
  items: z.array(customItem).default([]),
});

// ============================================================================
//  Discriminated union — the canonical Section type
// ============================================================================

export const section = z.discriminatedUnion('type', [
  profileSection,
  summarySection,
  experienceSection,
  educationSection,
  skillsSection,
  languagesSection,
  awardsSection,
  certificationsSection,
  publicationsSection,
  volunteeringSection,
  referencesSection,
  projectsSection,
  interestsSection,
  customSection,
]);

export type Section = z.infer<typeof section>;
export type SectionType = Section['type'];

/** All 14 section types as a const tuple — used for UI pickers, defaults, etc. */
export const SECTION_TYPES = [
  'profile',
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'awards',
  'certifications',
  'publications',
  'volunteering',
  'references',
  'projects',
  'interests',
  'custom',
] as const satisfies readonly SectionType[];
