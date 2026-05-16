/**
 * Classic template style tokens.
 *
 * These are the SINGLE SOURCE OF TRUTH for visual values shared between the
 * HTML preview (`html.tsx`) and the PDF export (`pdf.tsx`). Both renderers
 * import from this file. Changes here ripple to both paths automatically,
 * keeping HTML/PDF parity by construction rather than discipline.
 *
 * Values are in absolute units (pt for PDF, px for HTML at the standard
 * 1pt = 1.333px ratio on most screens). The tokens are intentionally small
 * — Classic is a conservative, ATS-friendly serif/sans template.
 */

export const classicTokens = {
  /** Page-level padding (used as @react-pdf Page padding and HTML article p-X). */
  page: {
    paddingTopPt: 36,
    paddingBottomPt: 36,
    paddingLeftPt: 40,
    paddingRightPt: 40,
  },

  /** Color palette. Sober, high-contrast for ATS scanners and printers. */
  colors: {
    text: '#0f172a',
    muted: '#475569',
    rule: '#cbd5e1',
    accent: '#0f172a',
    background: '#ffffff',
  },

  /** Font families. Must match the strings used in pdf-fonts.ts Font.register(). */
  fonts: {
    sans: 'Inter',
    serif: 'Merriweather',
  },

  /** Type scale, in points. Used directly by PDF; HTML divides by 0.75 to get px. */
  type: {
    nameSize: 22,
    headlineSize: 11,
    sectionHeadingSize: 10,
    bodySize: 9.5,
    smallSize: 8.5,
    lineHeight: 1.4,
  },

  /** Vertical rhythm. */
  spacing: {
    sectionGap: 14,
    itemGap: 8,
    headerToBodyGap: 12,
    afterHeaderRule: 4,
    bulletIndent: 12,
  },

  /** Section heading style — uppercase, letter-spaced, ruled underline. */
  sectionHeading: {
    uppercase: true,
    letterSpacing: 1.2,
    weight: 700,
  },
} as const;

/** Convenience: convert a point value to a px-equivalent for HTML rendering. */
export function ptToPx(pt: number): number {
  return Math.round(pt * (4 / 3));
}

/** Tailwind-style inline style helpers for the HTML renderer. */
export const classicHtmlStyle = {
  page: {
    color: classicTokens.colors.text,
    fontFamily: `${classicTokens.fonts.sans}, ui-sans-serif, system-ui, sans-serif`,
    fontSize: `${classicTokens.type.bodySize}pt`,
    lineHeight: classicTokens.type.lineHeight,
    background: classicTokens.colors.background,
  },
  name: {
    fontSize: `${classicTokens.type.nameSize}pt`,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    color: classicTokens.colors.text,
  },
  headline: {
    fontSize: `${classicTokens.type.headlineSize}pt`,
    color: classicTokens.colors.muted,
  },
  contact: {
    fontSize: `${classicTokens.type.smallSize}pt`,
    color: classicTokens.colors.muted,
  },
  summaryParagraph: {
    fontSize: `${classicTokens.type.bodySize}pt`,
    lineHeight: classicTokens.type.lineHeight,
  },
  sectionHeading: {
    fontSize: `${classicTokens.type.sectionHeadingSize}pt`,
    fontWeight: classicTokens.sectionHeading.weight,
    textTransform: 'uppercase' as const,
    letterSpacing: `${classicTokens.sectionHeading.letterSpacing}px`,
    color: classicTokens.colors.text,
    borderBottom: `1px solid ${classicTokens.colors.rule}`,
    paddingBottom: '2px',
    marginBottom: '6px',
  },
  itemTitle: {
    fontSize: `${classicTokens.type.bodySize}pt`,
    fontWeight: 700,
    color: classicTokens.colors.text,
  },
  itemSubtitle: {
    fontSize: `${classicTokens.type.bodySize}pt`,
    color: classicTokens.colors.muted,
  },
  itemDate: {
    fontSize: `${classicTokens.type.smallSize}pt`,
    color: classicTokens.colors.muted,
    fontVariantNumeric: 'tabular-nums' as const,
  },
} as const;
