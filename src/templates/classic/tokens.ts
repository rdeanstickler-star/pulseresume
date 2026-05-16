import type { TokenSet } from '../_shared/types';

/**
 * Classic template style tokens.
 *
 * Conforms to the shared `TokenSet` contract so the customization layer
 * (M6) can merge `meta.theme` overrides on top via `applyTheme`. The HTML
 * helper `classicHtmlStyle` is kept for backwards compatibility with the
 * existing classic/html.tsx file — it reads from the static `classicTokens`
 * before any theme override.
 */
export const classicTokens: TokenSet = {
  page: {
    paddingTopPt: 36,
    paddingBottomPt: 36,
    paddingLeftPt: 40,
    paddingRightPt: 40,
  },
  colors: {
    text: '#0f172a',
    muted: '#475569',
    rule: '#cbd5e1',
    accent: '#0f172a',
    onAccent: '#ffffff',
    background: '#ffffff',
    surface: '#f8fafc',
  },
  fonts: {
    sans: 'Inter',
    serif: 'Merriweather',
    mono: 'JetBrains Mono',
    body: 'sans',
    heading: 'sans',
  },
  type: {
    nameSize: 22,
    headlineSize: 11,
    sectionHeadingSize: 10,
    bodySize: 9.5,
    smallSize: 8.5,
    lineHeight: 1.4,
  },
  spacing: {
    sectionGap: 14,
    itemGap: 8,
    headerToBodyGap: 12,
    afterHeaderRule: 4,
    bulletIndent: 12,
  },
  sectionHeading: {
    uppercase: true,
    letterSpacing: 1.2,
    weight: 700,
    rule: 'border-bottom',
  },
};

/** Convenience: convert a point value to a px-equivalent for HTML rendering. */
export function ptToPx(pt: number): number {
  return Math.round(pt * (4 / 3));
}

/**
 * Pre-computed inline-style helpers for the Classic HTML renderer. These
 * derive from `classicTokens` and are NOT theme-aware. The Classic html.tsx
 * file uses these directly today; in a follow-up we'll inline them with
 * applyTheme so Classic also responds to meta.theme overrides.
 */
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
