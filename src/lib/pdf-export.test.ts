import { describe, expect, it } from 'vitest';
import { buildPdfFilename } from './pdf-export';
import { developerSeed } from '@/schema/seeds/developer';

describe('buildPdfFilename', () => {
  it('slugifies the name and appends -resume.pdf', () => {
    expect(buildPdfFilename(developerSeed)).toBe('avery-chen-resume.pdf');
  });

  it('falls back to "resume" when name is empty', () => {
    const r = { ...developerSeed, basics: { ...developerSeed.basics, name: '' } };
    expect(buildPdfFilename(r)).toBe('resume-resume.pdf');
  });

  it('lower-cases and replaces punctuation with single dashes', () => {
    const r = {
      ...developerSeed,
      basics: { ...developerSeed.basics, name: 'Dr. María-José O’Connor, Jr.' },
    };
    const result = buildPdfFilename(r);
    expect(result.endsWith('-resume.pdf')).toBe(true);
    expect(result).toMatch(/^[a-z0-9-]+-resume\.pdf$/);
    expect(result).not.toMatch(/--/);
  });

  it('strips leading/trailing dashes', () => {
    const r = {
      ...developerSeed,
      basics: { ...developerSeed.basics, name: '  !!!  trailing  !!!  ' },
    };
    expect(buildPdfFilename(r)).toBe('trailing-resume.pdf');
  });
});
