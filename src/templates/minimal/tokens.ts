import type { TokenSet } from '../_shared/types';

/**
 * Minimal — single column, generous whitespace, no rules.
 * Section headings use small caps + extra space, no decorative bar.
 */
export const minimalTokens: TokenSet = {
  page: { paddingTopPt: 50, paddingBottomPt: 50, paddingLeftPt: 60, paddingRightPt: 60 },
  colors: {
    text: '#111111',
    muted: '#5e5e5e',
    rule: '#e6e6e6',
    accent: '#111111',
    onAccent: '#ffffff',
    background: '#ffffff',
    surface: '#fafafa',
  },
  fonts: {
    sans: 'Inter',
    serif: 'Merriweather',
    mono: 'JetBrains Mono',
    body: 'sans',
    heading: 'sans',
  },
  type: {
    nameSize: 20,
    headlineSize: 10.5,
    sectionHeadingSize: 9,
    bodySize: 9.5,
    smallSize: 8.5,
    lineHeight: 1.6,
  },
  spacing: {
    sectionGap: 22,
    itemGap: 12,
    headerToBodyGap: 20,
    afterHeaderRule: 0,
    bulletIndent: 12,
  },
  sectionHeading: {
    uppercase: true,
    letterSpacing: 2.2,
    weight: 600,
    rule: 'none',
  },
};
