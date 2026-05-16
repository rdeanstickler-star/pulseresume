import { describe, expect, it } from 'vitest';
import { resume } from '../resume';
import { SEEDS, developerSeed, designerSeed, executiveSeed } from './index';

describe('seed resumes', () => {
  it.each(SEEDS)('seed "$slug" parses through the Zod schema', ({ slug, data }) => {
    const result = resume.safeParse(data);
    if (!result.success) {
      // Surface the issue path so debugging is fast.
      console.error(
        `Seed "${slug}" failed validation:\n`,
        result.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n'),
      );
    }
    expect(result.success).toBe(true);
  });

  it('exports three named seeds at SEEDS', () => {
    expect(SEEDS).toHaveLength(3);
    expect(SEEDS.map((s) => s.slug).sort()).toEqual(['designer', 'developer', 'executive']);
  });

  it('each seed picks a different template (proves variety in fixtures)', () => {
    const templates = new Set([
      developerSeed.meta.template,
      designerSeed.meta.template,
      executiveSeed.meta.template,
    ]);
    expect(templates.size).toBe(3);
  });

  it('every seed has at least one visible section', () => {
    for (const { slug, data } of SEEDS) {
      const visibleCount = data.sections.filter((s) => s.visible).length;
      expect(visibleCount, `seed "${slug}" has no visible sections`).toBeGreaterThan(0);
    }
  });

  it('every seed has a name and headline', () => {
    for (const { slug, data } of SEEDS) {
      expect(data.basics.name, `seed "${slug}" missing name`).not.toBe('');
      expect(data.basics.headline, `seed "${slug}" missing headline`).not.toBe('');
    }
  });

  it('every seed round-trips through JSON serialization', () => {
    for (const { slug, data } of SEEDS) {
      const serialized = JSON.stringify(data);
      const reparsed = resume.parse(JSON.parse(serialized));
      expect(reparsed, `seed "${slug}" failed round-trip`).toEqual(data);
    }
  });
});
