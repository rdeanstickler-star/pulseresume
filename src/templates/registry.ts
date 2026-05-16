/**
 * Central template registry. Used by the template picker UI to enumerate
 * available templates with display metadata.
 */
import type { Meta } from '@/schema/resume';

export type TemplateId = Meta['template'];

export interface TemplateInfo {
  id: TemplateId;
  label: string;
  description: string;
}

export const TEMPLATES: ReadonlyArray<TemplateInfo> = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Single column · sans-serif · ATS-friendly default',
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Accent stripe · vivid headings · sans-serif',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Generous whitespace · no rules · serif-quiet sans',
  },
  {
    id: 'creative',
    label: 'Creative',
    description: 'Color-block hero · accent headings · sans-serif',
  },
  {
    id: 'executive',
    label: 'Executive',
    description: 'Centered serif · ruled dividers · formal',
  },
  {
    id: 'technical',
    label: 'Technical',
    description: 'Monospace headings · compact density · cyan accent',
  },
];
