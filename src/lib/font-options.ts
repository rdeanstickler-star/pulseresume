/**
 * Curated Google Fonts for resume use. Each entry is one of:
 *  - sans   for body / sans-headings
 *  - serif  for serif body / serif-headings
 *  - mono   for monospace headings (Technical template)
 *
 * The PDF renderer's `pdf-fonts.ts` already registers Inter, Merriweather,
 * and JetBrains Mono. When a user picks a font outside that list, the PDF
 * export still works — @react-pdf falls back to Helvetica for unknown
 * families and surfaces a console warning. We document this in the picker
 * UI tooltip.
 */
export type FontSlot = 'sans' | 'serif' | 'mono';

export interface FontOption {
  family: string;
  slot: FontSlot;
  /** True when the PDF renderer has this family registered. */
  pdfRegistered: boolean;
}

export const FONT_OPTIONS: ReadonlyArray<FontOption> = [
  // Sans
  { family: 'Inter', slot: 'sans', pdfRegistered: true },
  { family: 'Roboto', slot: 'sans', pdfRegistered: false },
  { family: 'Lato', slot: 'sans', pdfRegistered: false },
  // Serif
  { family: 'Merriweather', slot: 'serif', pdfRegistered: true },
  { family: 'Source Serif Pro', slot: 'serif', pdfRegistered: false },
  { family: 'Playfair Display', slot: 'serif', pdfRegistered: false },
  { family: 'EB Garamond', slot: 'serif', pdfRegistered: false },
  // Mono
  { family: 'JetBrains Mono', slot: 'mono', pdfRegistered: true },
];

export function fontsBySlot(slot: FontSlot): FontOption[] {
  return FONT_OPTIONS.filter((f) => f.slot === slot);
}
