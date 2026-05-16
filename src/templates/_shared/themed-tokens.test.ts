import { describe, expect, it } from 'vitest';
import { applyTheme } from './themed-tokens';
import { classicTokens } from '../classic/tokens';
import type { Meta } from '@/schema/resume';

const sampleTheme: Meta['theme'] = {
  primaryColor: '#000000',
  accentColor: '#ff0000',
  background: '#f0f0f0',
  foreground: '#222222',
  sansFont: 'Lato',
  serifFont: 'Playfair Display',
  monoFont: 'JetBrains Mono',
  fontSize: 11,
  lineHeight: 1.6,
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 25,
  marginRight: 25,
};

describe('applyTheme', () => {
  it('overrides accent, foreground, and background colors', () => {
    const t = applyTheme(classicTokens, sampleTheme);
    expect(t.colors.accent).toBe('#ff0000');
    expect(t.colors.text).toBe('#222222');
    expect(t.colors.background).toBe('#f0f0f0');
  });

  it('preserves muted and rule colors from the base template', () => {
    const t = applyTheme(classicTokens, sampleTheme);
    expect(t.colors.muted).toBe(classicTokens.colors.muted);
    expect(t.colors.rule).toBe(classicTokens.colors.rule);
  });

  it('overrides font families', () => {
    const t = applyTheme(classicTokens, sampleTheme);
    expect(t.fonts.sans).toBe('Lato');
    expect(t.fonts.serif).toBe('Playfair Display');
    expect(t.fonts.mono).toBe('JetBrains Mono');
  });

  it('preserves which font slot is body vs heading', () => {
    const t = applyTheme(classicTokens, sampleTheme);
    expect(t.fonts.body).toBe(classicTokens.fonts.body);
    expect(t.fonts.heading).toBe(classicTokens.fonts.heading);
  });

  it('overrides body size and line height; scales heading sizes proportionally', () => {
    const t = applyTheme(classicTokens, sampleTheme);
    expect(t.type.bodySize).toBe(11);
    expect(t.type.lineHeight).toBe(1.6);
    // Original body was 9.5, new is 11 → scale ≈ 1.158. Original name 22 → ~25.5.
    expect(t.type.nameSize).toBeGreaterThan(classicTokens.type.nameSize);
    expect(t.type.smallSize).toBeGreaterThan(classicTokens.type.smallSize);
  });

  it('overrides page padding from margin theme values', () => {
    const t = applyTheme(classicTokens, sampleTheme);
    expect(t.page.paddingTopPt).toBe(20);
    expect(t.page.paddingBottomPt).toBe(20);
    expect(t.page.paddingLeftPt).toBe(25);
    expect(t.page.paddingRightPt).toBe(25);
  });

  it('preserves the template-specific spacing rhythm', () => {
    const t = applyTheme(classicTokens, sampleTheme);
    expect(t.spacing).toEqual(classicTokens.spacing);
  });

  it('preserves the template-specific section heading style', () => {
    const t = applyTheme(classicTokens, sampleTheme);
    expect(t.sectionHeading).toEqual(classicTokens.sectionHeading);
  });
});
