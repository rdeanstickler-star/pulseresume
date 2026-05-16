import type { TokenSet } from '../_shared/types';

/** Executive — serif body, centered hero, conservative double-rule dividers. */
export const executiveTokens: TokenSet = {
  page: { paddingTopPt: 40, paddingBottomPt: 40, paddingLeftPt: 50, paddingRightPt: 50 },
  colors: {
    text: '#0c0a09',
    muted: '#4b4640',
    rule: '#a8a29e',
    accent: '#1e3a8a',
    onAccent: '#ffffff',
    background: '#fefefe',
    surface: '#f5f5f4',
  },
  fonts: {
    sans: 'Inter',
    serif: 'Merriweather',
    mono: 'JetBrains Mono',
    body: 'serif',
    heading: 'serif',
  },
  type: {
    nameSize: 22,
    headlineSize: 11.5,
    sectionHeadingSize: 9.5,
    bodySize: 9.5,
    smallSize: 8.5,
    lineHeight: 1.5,
  },
  spacing: {
    sectionGap: 16,
    itemGap: 9,
    headerToBodyGap: 12,
    afterHeaderRule: 6,
    bulletIndent: 12,
  },
  sectionHeading: {
    uppercase: true,
    letterSpacing: 2,
    weight: 700,
    rule: 'border-bottom',
  },
};
