import type { TokenSet } from '../_shared/types';

/** Technical — monospace headings, compact density, cyan accent. */
export const technicalTokens: TokenSet = {
  page: { paddingTopPt: 32, paddingBottomPt: 32, paddingLeftPt: 40, paddingRightPt: 40 },
  colors: {
    text: '#0f172a',
    muted: '#475569',
    rule: '#cbd5e1',
    accent: '#0891b2',
    onAccent: '#ffffff',
    background: '#ffffff',
    surface: '#f8fafc',
  },
  fonts: {
    sans: 'Inter',
    serif: 'Merriweather',
    mono: 'JetBrains Mono',
    body: 'sans',
    heading: 'mono',
  },
  type: {
    nameSize: 20,
    headlineSize: 10.5,
    sectionHeadingSize: 9,
    bodySize: 9,
    smallSize: 8,
    lineHeight: 1.35,
  },
  spacing: {
    sectionGap: 12,
    itemGap: 7,
    headerToBodyGap: 10,
    afterHeaderRule: 4,
    bulletIndent: 10,
  },
  sectionHeading: {
    uppercase: true,
    letterSpacing: 0.6,
    weight: 700,
    rule: 'none',
    brackets: ['[ ', ' ]'],
  },
};
