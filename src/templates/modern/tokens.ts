import type { TokenSet } from '../_shared/types';

/**
 * Modern — clean sans-serif with a vivid accent stripe.
 * Section headings are accent-colored, all-caps, with a thin inline bar.
 */
export const modernTokens: TokenSet = {
  page: { paddingTopPt: 32, paddingBottomPt: 32, paddingLeftPt: 44, paddingRightPt: 44 },
  colors: {
    text: '#0c1422',
    muted: '#5b6577',
    rule: '#e2e8f0',
    accent: '#0ea5e9',
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
    nameSize: 24,
    headlineSize: 11,
    sectionHeadingSize: 9,
    bodySize: 9.5,
    smallSize: 8.5,
    lineHeight: 1.45,
  },
  spacing: {
    sectionGap: 14,
    itemGap: 8,
    headerToBodyGap: 14,
    afterHeaderRule: 6,
    bulletIndent: 12,
  },
  sectionHeading: {
    uppercase: true,
    letterSpacing: 1.6,
    weight: 700,
    rule: 'inline-bar',
  },
};
