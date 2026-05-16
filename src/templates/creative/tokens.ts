import type { TokenSet } from '../_shared/types';

/** Creative — color-block hero header, sans-serif body, vivid accent. */
export const creativeTokens: TokenSet = {
  page: { paddingTopPt: 0, paddingBottomPt: 36, paddingLeftPt: 40, paddingRightPt: 40 },
  colors: {
    text: '#1f2937',
    muted: '#5b6577',
    rule: '#e5e7eb',
    accent: '#7c3aed',
    onAccent: '#ffffff',
    background: '#ffffff',
    surface: '#faf5ff',
  },
  fonts: {
    sans: 'Inter',
    serif: 'Merriweather',
    mono: 'JetBrains Mono',
    body: 'sans',
    heading: 'sans',
  },
  type: {
    nameSize: 26,
    headlineSize: 12,
    sectionHeadingSize: 9.5,
    bodySize: 9.5,
    smallSize: 8.5,
    lineHeight: 1.45,
  },
  spacing: {
    sectionGap: 14,
    itemGap: 8,
    headerToBodyGap: 18,
    afterHeaderRule: 6,
    bulletIndent: 12,
  },
  sectionHeading: {
    uppercase: true,
    letterSpacing: 1.4,
    weight: 700,
    rule: 'border-bottom',
  },
};
