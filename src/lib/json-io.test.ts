import { describe, expect, it } from 'vitest';
import { buildJsonFilename, exportJson, importJson } from './json-io';
import { developerSeed } from '@/schema/seeds/developer';

describe('exportJson', () => {
  it('produces valid JSON', () => {
    const text = exportJson(developerSeed);
    expect(() => JSON.parse(text)).not.toThrow();
  });
  it('round-trips through importJson with no data loss', () => {
    const text = exportJson(developerSeed);
    const result = importJson(text);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.resume).toEqual(developerSeed);
  });
  it('formats with 2-space indentation', () => {
    const text = exportJson(developerSeed);
    expect(text).toContain('\n  "');
  });
});

describe('importJson', () => {
  it('rejects empty input', () => {
    expect(importJson('')).toEqual({ ok: false, error: expect.stringMatching(/empty/i) });
  });
  it('rejects whitespace-only input', () => {
    expect(importJson('   \n\t  ')).toEqual({
      ok: false,
      error: expect.stringMatching(/empty/i),
    });
  });
  it('reports JSON parse errors specifically', () => {
    const result = importJson('{ not valid json');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/JSON parse error/i);
  });
  it('reports schema validation errors with field paths', () => {
    const result = importJson(
      JSON.stringify({
        schemaVersion: 1,
        meta: {},
        basics: { email: 'not an email' },
        sections: [],
      }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/email/i);
  });
  it('runs migrations on un-versioned documents (v0 → v1)', () => {
    // No schemaVersion → bootstrap migration stamps it as 1.
    const result = importJson(
      JSON.stringify({
        meta: {},
        basics: { name: 'V0 User' },
        sections: [],
      }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.resume.schemaVersion).toBe(1);
      expect(result.resume.basics.name).toBe('V0 User');
    }
  });
});

describe('buildJsonFilename', () => {
  it('slugifies the name with -resume.json suffix', () => {
    const name = buildJsonFilename(developerSeed);
    expect(name).toBe('avery-chen-resume.json');
  });
  it('falls back to resume-resume.json when name is empty', () => {
    const r = { ...developerSeed, basics: { ...developerSeed.basics, name: '' } };
    expect(buildJsonFilename(r)).toBe('resume-resume.json');
  });
  it('strips diacritics', () => {
    const r = { ...developerSeed, basics: { ...developerSeed.basics, name: 'Renée Östberg' } };
    expect(buildJsonFilename(r)).toBe('renee-ostberg-resume.json');
  });
});
