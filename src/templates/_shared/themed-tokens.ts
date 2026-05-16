import type { Meta } from '@/schema/resume';
import type { TokenSet } from './types';

/**
 * Merge a template's base `TokenSet` with the user's `meta.theme` overrides
 * to produce the runtime tokens used for rendering.
 *
 * Strategy:
 * - COLORS: theme.accentColor + theme.foreground + theme.background override
 *   the base palette. `text`, `muted`, `rule` are derived from those overrides
 *   only when the user has changed the defaults — otherwise we preserve the
 *   template's deliberate hue choices.
 * - FONTS: theme.sansFont/serifFont/monoFont override the corresponding slots.
 *   The template's body/heading slot assignments (which family slot is body
 *   vs. heading) are PRESERVED so each template keeps its identity.
 * - TYPE SCALE: theme.fontSize and theme.lineHeight override bodySize and
 *   lineHeight. nameSize, sectionHeadingSize, etc., scale proportionally.
 * - MARGINS: theme.margin{Top,Bottom,Left,Right} override page padding.
 *
 * `spacing` (sectionGap, itemGap, etc.) and `sectionHeading` style stay
 * locked to the template's identity — these are intrinsic to the design.
 */
export function applyTheme(base: TokenSet, theme: Meta['theme']): TokenSet {
  const fontScale = theme.fontSize / base.type.bodySize;

  return {
    ...base,
    page: {
      paddingTopPt: theme.marginTop,
      paddingBottomPt: theme.marginBottom,
      paddingLeftPt: theme.marginLeft,
      paddingRightPt: theme.marginRight,
    },
    colors: {
      ...base.colors,
      text: theme.foreground,
      accent: theme.accentColor,
      background: theme.background,
    },
    fonts: {
      ...base.fonts,
      sans: theme.sansFont,
      serif: theme.serifFont,
      mono: theme.monoFont,
    },
    type: {
      ...base.type,
      bodySize: theme.fontSize,
      lineHeight: theme.lineHeight,
      nameSize: Math.round(base.type.nameSize * fontScale * 10) / 10,
      headlineSize: Math.round(base.type.headlineSize * fontScale * 10) / 10,
      sectionHeadingSize: Math.round(base.type.sectionHeadingSize * fontScale * 10) / 10,
      smallSize: Math.round(base.type.smallSize * fontScale * 10) / 10,
    },
  };
}
