import type { Resume } from '../resume';
import { developerSeed } from './developer';
import { designerSeed } from './designer';
import { executiveSeed } from './executive';

/**
 * Curated example resumes loadable from the editor's "Load example" picker.
 * All three pass `resume.parse(...)` and demonstrate different template
 * choices, section combinations, and content density.
 */
export interface Seed {
  /** URL-safe slug for routing / dropdown values. */
  slug: string;
  /** Display label for the picker UI. */
  label: string;
  /** Short one-liner shown under the label. */
  description: string;
  /** The resume document itself. */
  data: Resume;
}

export const SEEDS: ReadonlyArray<Seed> = [
  {
    slug: 'developer',
    label: 'Staff Software Engineer',
    description: 'Technical template, OSS projects, skill keywords.',
    data: developerSeed,
  },
  {
    slug: 'designer',
    label: 'Senior Product Designer',
    description: 'Creative template, rich-text descriptions, awards.',
    data: designerSeed,
  },
  {
    slug: 'executive',
    label: 'Chief Revenue Officer',
    description: 'Executive template, summary-led narrative, board roles.',
    data: executiveSeed,
  },
];

export { developerSeed, designerSeed, executiveSeed };
