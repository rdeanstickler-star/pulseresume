import { describe, expect, it } from 'vitest';
import { resume, SCHEMA_VERSION } from './resume';
import { dateString, emailString, urlString, skillLevel, languageFluency } from './types';
import { basics } from './basics';

describe('resume schema (top-level)', () => {
  it('parses a minimal-but-valid resume', () => {
    const minimal = {
      schemaVersion: 1,
      meta: {
        template: 'classic',
        pageSize: 'a4',
        theme: {
          primaryColor: '#000',
          accentColor: '#0f0',
          background: '#fff',
          foreground: '#000',
          sansFont: 'Inter',
          serifFont: 'Merriweather',
          monoFont: 'JetBrains Mono',
          fontSize: 10,
          lineHeight: 1.4,
          marginTop: 16,
          marginBottom: 16,
          marginLeft: 16,
          marginRight: 16,
        },
        updatedAt: '2026-05-15T00:00:00.000Z',
      },
      basics: {
        name: 'Test User',
        headline: '',
        email: '',
        phone: '',
        url: '',
        photo: { url: '', visible: false },
        summary: '',
        location: { address: '', postalCode: '', city: '', countryCode: '', region: '' },
      },
      sections: [],
    };
    const result = resume.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it('exposes SCHEMA_VERSION as a literal 1', () => {
    expect(SCHEMA_VERSION).toBe(1);
  });

  it('rejects a resume with the wrong schemaVersion', () => {
    const wrong = { schemaVersion: 99, meta: {}, basics: {}, sections: [] };
    const result = resume.safeParse(wrong);
    expect(result.success).toBe(false);
  });

  it('defaults meta.template to classic and pageSize to a4', () => {
    const data = resume.parse({
      schemaVersion: 1,
      meta: {},
      basics: {},
      sections: [],
    });
    expect(data.meta.template).toBe('classic');
    expect(data.meta.pageSize).toBe('a4');
  });

  it('round-trips through JSON.stringify / parse without loss', () => {
    const data = resume.parse({
      schemaVersion: 1,
      meta: {},
      basics: { name: 'Round Tripper', email: 'rt@example.com' },
      sections: [],
    });
    const serialized = JSON.stringify(data);
    const reparsed = resume.parse(JSON.parse(serialized));
    expect(reparsed).toEqual(data);
  });
});

describe('schema primitives', () => {
  describe('dateString', () => {
    it('accepts year-only', () => {
      expect(dateString.safeParse('2026').success).toBe(true);
    });
    it('accepts year-month', () => {
      expect(dateString.safeParse('2026-05').success).toBe(true);
    });
    it('accepts year-month-day', () => {
      expect(dateString.safeParse('2026-05-15').success).toBe(true);
    });
    it('rejects garbage', () => {
      expect(dateString.safeParse('next tuesday').success).toBe(false);
      expect(dateString.safeParse('2026-13').success).toBe(false);
      expect(dateString.safeParse('2026-00').success).toBe(false);
      expect(dateString.safeParse('2026-05-32').success).toBe(false);
    });
  });

  describe('urlString', () => {
    it('accepts empty string (drafts)', () => {
      expect(urlString.safeParse('').success).toBe(true);
    });
    it('accepts a valid URL', () => {
      expect(urlString.safeParse('https://example.com').success).toBe(true);
    });
    it('rejects a non-URL non-empty string', () => {
      expect(urlString.safeParse('not a url').success).toBe(false);
    });
  });

  describe('emailString', () => {
    it('accepts empty string (drafts)', () => {
      expect(emailString.safeParse('').success).toBe(true);
    });
    it('accepts a valid email', () => {
      expect(emailString.safeParse('a@b.co').success).toBe(true);
    });
    it('rejects a non-email non-empty string', () => {
      expect(emailString.safeParse('not-an-email').success).toBe(false);
    });
  });

  describe('enums', () => {
    it('skillLevel covers the five-step ladder', () => {
      expect(skillLevel.options).toEqual([
        'novice',
        'beginner',
        'intermediate',
        'advanced',
        'expert',
      ]);
    });
    it('languageFluency covers elementary→native', () => {
      expect(languageFluency.options).toEqual([
        'elementary',
        'limited',
        'professional',
        'fluent',
        'native',
      ]);
    });
  });
});

describe('basics schema', () => {
  it('defaults every field to empty', () => {
    const parsed = basics.parse({});
    expect(parsed.name).toBe('');
    expect(parsed.email).toBe('');
    expect(parsed.photo.visible).toBe(false);
    expect(parsed.location.countryCode).toBe('');
  });

  it('rejects an invalid email at the field level', () => {
    const result = basics.safeParse({ email: 'not an email' });
    expect(result.success).toBe(false);
  });
});
