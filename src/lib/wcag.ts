/**
 * WCAG 2.1 contrast helpers — used by the customization panel to warn
 * users when their custom palette fails accessibility thresholds.
 *
 * No dependencies; matches the official W3C formula bit-for-bit.
 */

/** Parse a `#RGB` or `#RRGGBB` hex string into [r, g, b] (0–255). Throws on bad input. */
export function parseHex(hex: string): [number, number, number] {
  const cleaned = hex.replace(/^#/, '').trim().toLowerCase();
  const match = /^([0-9a-f]{3}|[0-9a-f]{6})$/.exec(cleaned);
  if (!match) throw new Error(`Invalid hex color: ${hex}`);
  const v =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;
  const r = Number.parseInt(v.slice(0, 2), 16);
  const g = Number.parseInt(v.slice(2, 4), 16);
  const b = Number.parseInt(v.slice(4, 6), 16);
  return [r, g, b];
}

/**
 * sRGB → relative luminance per WCAG. Result in [0, 1].
 */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * WCAG 2.1 contrast ratio between two colors. Returns a value in [1, 21].
 * 1 = identical luminance, 21 = white on black.
 */
export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagLevel = 'fail' | 'AA-large' | 'AA' | 'AAA';

/**
 * Classify a contrast ratio against WCAG 2.1 thresholds for normal text:
 *   AA  ≥ 4.5
 *   AAA ≥ 7.0
 * Large text (≥ 18pt or 14pt bold) loosens to ≥ 3.0; we surface that as
 * `AA-large`. Below 3.0 fails.
 */
export function classifyContrast(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA-large';
  return 'fail';
}

/** Human label for the rating used in UI hint text. */
export function contrastLabel(level: WcagLevel): string {
  switch (level) {
    case 'AAA':
      return 'AAA · excellent for body text';
    case 'AA':
      return 'AA · passes for body text';
    case 'AA-large':
      return 'AA Large · only large/bold text';
    case 'fail':
      return 'Below WCAG threshold';
  }
}
