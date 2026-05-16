import { describe, expect, it } from 'vitest';
import { SECTION_TYPES, section, type SectionType } from './sections';

const stableId = (n: number) =>
  `00000000-0000-4000-8000-${n.toString(16).padStart(12, '0').toLowerCase()}`;

describe('section discriminated union', () => {
  it('exports all 14 section types', () => {
    const expected: SectionType[] = [
      'profile',
      'summary',
      'experience',
      'education',
      'skills',
      'languages',
      'awards',
      'certifications',
      'publications',
      'volunteering',
      'references',
      'projects',
      'interests',
      'custom',
    ];
    expect([...SECTION_TYPES]).toEqual(expected);
    expect(SECTION_TYPES).toHaveLength(14);
  });

  it.each(SECTION_TYPES)('parses an empty %s section', (type) => {
    const result = section.safeParse({
      id: stableId(1),
      name: type,
      type,
      visible: true,
      columns: 1,
      items: [],
    });
    expect(result.success).toBe(true);
  });

  it('discriminates by type — items get parsed against the matching item schema and extras are stripped', () => {
    const parsed = section.safeParse({
      id: stableId(2),
      name: 'Skills',
      type: 'skills',
      visible: true,
      columns: 1,
      items: [
        {
          id: stableId(3),
          name: 'Rust',
          // Extra fields from a foreign shape — Zod's default object mode strips them.
          company: 'should be stripped',
          position: 'should be stripped',
        },
      ],
    });
    expect(parsed.success).toBe(true);
    if (parsed.success && parsed.data.type === 'skills') {
      const item = parsed.data.items[0]!;
      expect(item.name).toBe('Rust');
      // Foreign fields are stripped — not present on the parsed object.
      expect((item as Record<string, unknown>).company).toBeUndefined();
      expect((item as Record<string, unknown>).position).toBeUndefined();
    }
  });

  it('rejects items missing their required fields (id is required everywhere)', () => {
    const noIdInExperience = section.safeParse({
      id: stableId(20),
      name: 'Experience',
      type: 'experience',
      visible: true,
      columns: 1,
      items: [
        {
          // id omitted
          company: 'Acme',
          position: 'Engineer',
        },
      ],
    });
    expect(noIdInExperience.success).toBe(false);
  });

  it('rejects items with the wrong id format (must be UUIDv4)', () => {
    const result = section.safeParse({
      id: stableId(21),
      name: 'Skills',
      type: 'skills',
      visible: true,
      columns: 1,
      items: [{ id: 'not-a-uuid', name: 'Rust' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown section types', () => {
    const result = section.safeParse({
      id: stableId(4),
      name: 'Mystery',
      type: 'mystery',
      visible: true,
      columns: 1,
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it('parses an experience section with one item', () => {
    const result = section.safeParse({
      id: stableId(5),
      name: 'Experience',
      type: 'experience',
      visible: true,
      columns: 1,
      items: [
        {
          id: stableId(6),
          company: 'Acme',
          position: 'Engineer',
          startDate: '2024-01',
          endDate: '',
          current: true,
          summary: '<p>Did things.</p>',
          highlights: ['Shipped it'],
        },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('experience');
      expect(result.data.items[0]).toMatchObject({ company: 'Acme', current: true });
    }
  });

  it('enforces summary section max-one-item', () => {
    const result = section.safeParse({
      id: stableId(7),
      name: 'Summary',
      type: 'summary',
      visible: true,
      columns: 1,
      items: [
        { id: stableId(8), content: '<p>first</p>', visible: true },
        { id: stableId(9), content: '<p>second</p>', visible: true },
      ],
    });
    expect(result.success).toBe(false);
  });
});
