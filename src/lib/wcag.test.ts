import { describe, expect, it } from 'vitest';
import {
  classifyContrast,
  contrastLabel,
  contrastRatio,
  parseHex,
  relativeLuminance,
} from './wcag';

describe('parseHex', () => {
  it('accepts 6-char hex with leading #', () => {
    expect(parseHex('#ffffff')).toEqual([255, 255, 255]);
    expect(parseHex('#000000')).toEqual([0, 0, 0]);
  });
  it('accepts 6-char hex without leading #', () => {
    expect(parseHex('aabbcc')).toEqual([170, 187, 204]);
  });
  it('expands 3-char shorthand', () => {
    expect(parseHex('#fab')).toEqual([255, 170, 187]);
  });
  it('rejects malformed input', () => {
    expect(() => parseHex('#gggggg')).toThrow();
    expect(() => parseHex('not a color')).toThrow();
    expect(() => parseHex('#ffff')).toThrow();
  });
});

describe('relativeLuminance', () => {
  it('returns 0 for pure black', () => {
    expect(relativeLuminance('#000000')).toBe(0);
  });
  it('returns 1 for pure white', () => {
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5);
  });
  it('returns mid-range for mid-gray', () => {
    expect(relativeLuminance('#808080')).toBeGreaterThan(0.2);
    expect(relativeLuminance('#808080')).toBeLessThan(0.3);
  });
});

describe('contrastRatio', () => {
  it('returns 21 for white-on-black (max contrast)', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 0);
  });
  it('returns 1 for identical colors', () => {
    expect(contrastRatio('#abcdef', '#abcdef')).toBe(1);
  });
  it('is order-independent', () => {
    expect(contrastRatio('#ffffff', '#0f172a')).toBeCloseTo(contrastRatio('#0f172a', '#ffffff'), 6);
  });
});

describe('classifyContrast', () => {
  it('classifies known points', () => {
    expect(classifyContrast(21)).toBe('AAA');
    expect(classifyContrast(7)).toBe('AAA');
    expect(classifyContrast(6.99)).toBe('AA');
    expect(classifyContrast(4.5)).toBe('AA');
    expect(classifyContrast(3.5)).toBe('AA-large');
    expect(classifyContrast(3)).toBe('AA-large');
    expect(classifyContrast(2.99)).toBe('fail');
    expect(classifyContrast(1)).toBe('fail');
  });
});

describe('contrastLabel', () => {
  it('returns a non-empty human label for every level', () => {
    expect(contrastLabel('AAA')).toMatch(/AAA/);
    expect(contrastLabel('AA')).toMatch(/AA/);
    expect(contrastLabel('AA-large')).toMatch(/large/i);
    expect(contrastLabel('fail')).toMatch(/below/i);
  });
});
