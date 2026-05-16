/**
 * Shared TokenSet contract used by all templates.
 *
 * Every template exports a `TokenSet` object from its own `tokens.ts`. The
 * shared section renderers in `_shared/sections-html.tsx` and
 * `_shared/sections-pdf.tsx` consume this contract — so all 14 section types
 * are rendered the same way across templates, with only the visual values
 * (colors, fonts, spacing, section-heading style) varying.
 *
 * Templates may STILL hand-roll their own Header and SectionFrame
 * components — those are the visually distinctive parts. Section item
 * bodies (experience entries, skill rows, etc.) are intentionally shared
 * so we don't drift across 6 implementations.
 */
export interface TokenSet {
  /** Page padding in points. Used by @react-pdf Page padding and HTML article. */
  page: {
    paddingTopPt: number;
    paddingBottomPt: number;
    paddingLeftPt: number;
    paddingRightPt: number;
  };
  /** Color palette. */
  colors: {
    text: string;
    muted: string;
    rule: string;
    /** Accent hue used for stripes, headings, contact lines. */
    accent: string;
    /** Foreground color used on top of accent (e.g., white-on-color hero). */
    onAccent: string;
    background: string;
    /** Subtle surface used by some templates for cards / left rails. */
    surface: string;
  };
  /** Font families. Must match strings registered in pdf-fonts.ts. */
  fonts: {
    sans: string;
    serif: string;
    mono: string;
    /** Which family the body text uses by default. */
    body: 'sans' | 'serif' | 'mono';
    /** Which family the headings use. */
    heading: 'sans' | 'serif' | 'mono';
  };
  /** Type scale, in points (PDF native). HTML uses pt directly. */
  type: {
    nameSize: number;
    headlineSize: number;
    sectionHeadingSize: number;
    bodySize: number;
    smallSize: number;
    lineHeight: number;
  };
  /** Vertical rhythm. */
  spacing: {
    sectionGap: number;
    itemGap: number;
    headerToBodyGap: number;
    afterHeaderRule: number;
    bulletIndent: number;
  };
  /** Section heading treatment. */
  sectionHeading: {
    uppercase: boolean;
    letterSpacing: number;
    weight: number;
    /** Decoration under the heading. */
    rule: 'border-bottom' | 'none' | 'inline-bar';
    /** Optional bracket characters: e.g. ['[ ', ' ]'] for Technical template. */
    brackets?: readonly [string, string];
  };
}

/** Resolves a font slot ('sans' | 'serif' | 'mono') to its family string. */
export function resolveFont(tokens: TokenSet, slot: 'sans' | 'serif' | 'mono'): string {
  return tokens.fonts[slot];
}

export function bodyFont(tokens: TokenSet): string {
  return resolveFont(tokens, tokens.fonts.body);
}

export function headingFont(tokens: TokenSet): string {
  return resolveFont(tokens, tokens.fonts.heading);
}
