import { describe, expect, it } from 'vitest';
import { itemTitle } from './item-title';
import type { Section } from '@/schema/sections';

const id = '00000000-0000-4000-8000-000000000001';

function fixture<T extends Section['type']>(
  type: T,
  itemOverrides: Record<string, unknown>,
): { section: Section; item: Section['items'][number] } {
  // Minimal section + item — only fields the test cares about. Cast through unknown
  // so we can avoid spelling every default; itemTitle only reads what it needs.
  const item = { id, visible: true, ...itemOverrides } as unknown as Section['items'][number];
  const section = {
    id,
    name: type,
    type,
    visible: true,
    columns: 1,
    items: [item],
  } as unknown as Section;
  return { section, item };
}

describe('itemTitle', () => {
  it('uses network for profile items', () => {
    const { section, item } = fixture('profile', { network: 'GitHub', username: 'octocat' });
    expect(itemTitle(section, item)).toBe('GitHub');
  });

  it('joins position + company for experience items', () => {
    const { section, item } = fixture('experience', { position: 'Engineer', company: 'Acme' });
    expect(itemTitle(section, item)).toBe('Engineer · Acme');
  });

  it('joins institution + area for education items', () => {
    const { section, item } = fixture('education', {
      institution: 'UC Berkeley',
      area: 'Computer Science',
    });
    expect(itemTitle(section, item)).toBe('UC Berkeley · Computer Science');
  });

  it('uses name for skill items', () => {
    const { section, item } = fixture('skills', { name: 'Rust' });
    expect(itemTitle(section, item)).toBe('Rust');
  });

  it('uses language for language items', () => {
    const { section, item } = fixture('languages', { language: 'Spanish' });
    expect(itemTitle(section, item)).toBe('Spanish');
  });

  it('falls back to a placeholder when fields are empty', () => {
    const { section, item } = fixture('experience', { position: '', company: '' });
    expect(itemTitle(section, item)).toBe('New experience');
  });

  it('always returns a non-empty string', () => {
    const types: Array<Section['type']> = [
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
    for (const type of types) {
      const { section, item } = fixture(type, {});
      expect(itemTitle(section, item).length).toBeGreaterThan(0);
    }
  });
});
