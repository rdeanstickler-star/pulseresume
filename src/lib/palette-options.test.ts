import { describe, expect, it } from 'vitest';
import { PALETTES } from './palette-options';
import { classifyContrast, contrastRatio } from './wcag';

describe('palette options', () => {
  it('exports 8 curated palettes', () => {
    expect(PALETTES).toHaveLength(8);
  });

  it('every palette has all required fields', () => {
    for (const p of PALETTES) {
      expect(p.id).toMatch(/^[a-z]+$/);
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.foreground).toMatch(/^#[0-9a-f]{6}$/i);
      expect(p.background).toMatch(/^#[0-9a-f]{6}$/i);
      expect(p.accent).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('every palette passes WCAG AA contrast for body text (foreground vs. background)', () => {
    for (const p of PALETTES) {
      const ratio = contrastRatio(p.foreground, p.background);
      const level = classifyContrast(ratio);
      expect(
        level === 'AA' || level === 'AAA',
        `${p.label}: ${ratio.toFixed(2)} : 1 → ${level} (must be AA or higher)`,
      ).toBe(true);
    }
  });

  it('palette ids are unique', () => {
    const ids = PALETTES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
