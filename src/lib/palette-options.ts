/**
 * Curated color palettes for the customization panel. Each one sets:
 *  - foreground (body text)
 *  - accent (section headings, links, color block hero)
 *  - background (page)
 *
 * All palettes pass WCAG AA contrast for body text. Verified at design time
 * via `contrastRatio(foreground, background) ≥ 4.5`.
 *
 * Users can also pick a custom hex; the customization panel shows a live
 * WCAG warning if their choice falls below AA.
 */
export interface Palette {
  id: string;
  label: string;
  swatch: string; // accent color shown as the swatch dot
  foreground: string;
  background: string;
  accent: string;
}

export const PALETTES: ReadonlyArray<Palette> = [
  {
    id: 'slate',
    label: 'Slate',
    swatch: '#0f172a',
    foreground: '#0f172a',
    background: '#ffffff',
    accent: '#0f172a',
  },
  {
    id: 'navy',
    label: 'Navy',
    swatch: '#1e3a8a',
    foreground: '#0c0a09',
    background: '#fefefe',
    accent: '#1e3a8a',
  },
  {
    id: 'forest',
    label: 'Forest',
    swatch: '#166534',
    foreground: '#1f2937',
    background: '#ffffff',
    accent: '#166534',
  },
  {
    id: 'crimson',
    label: 'Crimson',
    swatch: '#9f1239',
    foreground: '#1f2937',
    background: '#ffffff',
    accent: '#9f1239',
  },
  {
    id: 'plum',
    label: 'Plum',
    swatch: '#7c3aed',
    foreground: '#1f2937',
    background: '#ffffff',
    accent: '#7c3aed',
  },
  {
    id: 'teal',
    label: 'Teal',
    swatch: '#0f766e',
    foreground: '#0f172a',
    background: '#ffffff',
    accent: '#0f766e',
  },
  {
    id: 'sky',
    label: 'Sky',
    swatch: '#0ea5e9',
    foreground: '#0c1422',
    background: '#ffffff',
    accent: '#0ea5e9',
  },
  {
    id: 'amber',
    label: 'Amber',
    swatch: '#b45309',
    foreground: '#1f2937',
    background: '#fffbeb',
    accent: '#b45309',
  },
];
