import { describe, expect, it } from 'vitest';
import { FONT_OPTIONS, fontsBySlot } from './font-options';

describe('font options', () => {
  it('exports a non-empty list', () => {
    expect(FONT_OPTIONS.length).toBeGreaterThan(0);
  });

  it('each entry has a non-empty family and a valid slot', () => {
    for (const f of FONT_OPTIONS) {
      expect(f.family.length).toBeGreaterThan(0);
      expect(['sans', 'serif', 'mono']).toContain(f.slot);
      expect(typeof f.pdfRegistered).toBe('boolean');
    }
  });

  it('has at least one PDF-registered option per slot', () => {
    for (const slot of ['sans', 'serif', 'mono'] as const) {
      const registered = fontsBySlot(slot).some((f) => f.pdfRegistered);
      expect(registered, `slot ${slot} has no pdfRegistered family`).toBe(true);
    }
  });

  it('fontsBySlot filters correctly', () => {
    const sans = fontsBySlot('sans');
    expect(sans.length).toBeGreaterThan(0);
    expect(sans.every((f) => f.slot === 'sans')).toBe(true);
  });
});
