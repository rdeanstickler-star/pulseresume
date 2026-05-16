import { describe, expect, it, beforeEach } from 'vitest';
import { useResumeStore, cryptoRandomId, defaultSectionName } from './resume-store';
import { SECTION_TYPES } from '@/schema/sections';
import { developerSeed } from '@/schema/seeds/developer';

describe('resume store', () => {
  beforeEach(() => {
    // Reset to a clean state between tests; localStorage persists between tests in jsdom.
    localStorage.clear();
    useResumeStore.getState().reset();
  });

  it('starts with an empty valid resume', () => {
    const r = useResumeStore.getState().resume;
    expect(r.schemaVersion).toBe(1);
    expect(r.basics.name).toBe('');
    expect(r.sections).toEqual([]);
  });

  it('setBasics merges patches', () => {
    useResumeStore.getState().setBasics({ name: 'Alice' });
    useResumeStore.getState().setBasics({ email: 'a@b.co' });
    const r = useResumeStore.getState().resume;
    expect(r.basics.name).toBe('Alice');
    expect(r.basics.email).toBe('a@b.co');
    // unchanged fields preserved
    expect(r.basics.phone).toBe('');
  });

  it('rejects invalid email and surfaces lastError', () => {
    useResumeStore.getState().setBasics({ email: 'not-an-email' });
    expect(useResumeStore.getState().lastError).toMatch(/email/i);
  });

  it('clears lastError on the next valid mutation', () => {
    useResumeStore.getState().setBasics({ email: 'bad' });
    expect(useResumeStore.getState().lastError).not.toBeNull();
    useResumeStore.getState().setBasics({ name: 'Recovered' });
    expect(useResumeStore.getState().lastError).toBeNull();
  });

  it.each(SECTION_TYPES)('addSection creates a valid empty %s section', (type) => {
    const before = useResumeStore.getState().resume.sections.length;
    useResumeStore.getState().addSection(type);
    const after = useResumeStore.getState().resume.sections.length;
    expect(after).toBe(before + 1);
    const newest = useResumeStore.getState().resume.sections.at(-1);
    expect(newest?.type).toBe(type);
    expect(newest?.name).toBe(defaultSectionName(type));
    expect(newest?.visible).toBe(true);
    expect(newest?.items).toEqual([]);
  });

  it('removeSection drops the matching id', () => {
    const s = useResumeStore.getState().addSection('experience');
    useResumeStore.getState().addSection('skills');
    useResumeStore.getState().removeSection(s.id);
    const sections = useResumeStore.getState().resume.sections;
    expect(sections.find((x) => x.id === s.id)).toBeUndefined();
    expect(sections).toHaveLength(1);
    expect(sections[0]?.type).toBe('skills');
  });

  it('moveSection reorders within bounds', () => {
    const a = useResumeStore.getState().addSection('experience');
    const b = useResumeStore.getState().addSection('skills');
    const c = useResumeStore.getState().addSection('education');
    useResumeStore.getState().moveSection(c.id, 0);
    const order = useResumeStore.getState().resume.sections.map((s) => s.id);
    expect(order).toEqual([c.id, a.id, b.id]);
  });

  it('moveSection clamps to valid range', () => {
    const a = useResumeStore.getState().addSection('experience');
    useResumeStore.getState().addSection('skills');
    // Try to move beyond end
    useResumeStore.getState().moveSection(a.id, 99);
    const order = useResumeStore.getState().resume.sections.map((s) => s.type);
    expect(order).toEqual(['skills', 'experience']);
  });

  it('moveSection is a no-op when id not found', () => {
    useResumeStore.getState().addSection('experience');
    const before = useResumeStore.getState().resume.sections.map((s) => s.id);
    useResumeStore.getState().moveSection('nonexistent-id', 0);
    const after = useResumeStore.getState().resume.sections.map((s) => s.id);
    expect(after).toEqual(before);
  });

  it('updateSection patches name + visible + columns', () => {
    const s = useResumeStore.getState().addSection('experience');
    useResumeStore.getState().updateSection(s.id, { name: 'Career', visible: false, columns: 2 });
    const updated = useResumeStore.getState().resume.sections.find((x) => x.id === s.id);
    expect(updated?.name).toBe('Career');
    expect(updated?.visible).toBe(false);
    expect(updated?.columns).toBe(2);
    // type discriminant preserved
    expect(updated?.type).toBe('experience');
  });

  it('setResume replaces the entire document with a validated one', () => {
    useResumeStore.getState().setResume(developerSeed);
    expect(useResumeStore.getState().resume.basics.name).toBe(developerSeed.basics.name);
    expect(useResumeStore.getState().resume.sections.length).toBe(developerSeed.sections.length);
  });

  it('setMeta patches template and theme', () => {
    useResumeStore.getState().setMeta({ template: 'modern' });
    expect(useResumeStore.getState().resume.meta.template).toBe('modern');
  });

  it('updates meta.updatedAt on every successful mutation', () => {
    const before = useResumeStore.getState().resume.meta.updatedAt;
    // Force a tiny wait so the timestamp changes.
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        useResumeStore.getState().setBasics({ name: 'Time Traveler' });
        const after = useResumeStore.getState().resume.meta.updatedAt;
        expect(after).not.toBe(before);
        expect(new Date(after).getTime()).toBeGreaterThan(new Date(before).getTime());
        resolve();
      }, 5);
    });
  });

  describe('moveItem', () => {
    it('reorders items within a section', () => {
      useResumeStore.getState().setResume(developerSeed);
      // Pick the experience section from the seed (id seeded as 00000000-...-000000000002)
      const expSection = useResumeStore
        .getState()
        .resume.sections.find((s) => s.type === 'experience');
      expect(expSection).toBeDefined();
      if (!expSection || expSection.items.length < 2) return;
      const firstItemId = expSection.items[0]!.id;
      const secondItemId = expSection.items[1]!.id;
      useResumeStore.getState().moveItem(expSection.id, firstItemId, 1);
      const after = useResumeStore.getState().resume.sections.find((s) => s.id === expSection.id);
      expect(after?.items[0]?.id).toBe(secondItemId);
      expect(after?.items[1]?.id).toBe(firstItemId);
    });

    it('clamps the target index to valid range', () => {
      useResumeStore.getState().setResume(developerSeed);
      const expSection = useResumeStore
        .getState()
        .resume.sections.find((s) => s.type === 'experience');
      if (!expSection || expSection.items.length < 2) return;
      const firstItemId = expSection.items[0]!.id;
      useResumeStore.getState().moveItem(expSection.id, firstItemId, 999);
      const after = useResumeStore.getState().resume.sections.find((s) => s.id === expSection.id);
      expect(after?.items.at(-1)?.id).toBe(firstItemId);
    });

    it('is a no-op when the section id is unknown', () => {
      useResumeStore.getState().setResume(developerSeed);
      const before = useResumeStore.getState().resume.sections.map((s) => s.id);
      useResumeStore.getState().moveItem('nonexistent-section', 'whatever', 0);
      const after = useResumeStore.getState().resume.sections.map((s) => s.id);
      expect(after).toEqual(before);
    });

    it('is a no-op when the item id is unknown', () => {
      useResumeStore.getState().setResume(developerSeed);
      const expSection = useResumeStore
        .getState()
        .resume.sections.find((s) => s.type === 'experience');
      if (!expSection) return;
      const beforeOrder = expSection.items.map((i) => i.id);
      useResumeStore.getState().moveItem(expSection.id, 'nonexistent-item', 0);
      const after = useResumeStore.getState().resume.sections.find((s) => s.id === expSection.id);
      expect(after?.items.map((i) => i.id)).toEqual(beforeOrder);
    });

    it('is a no-op when fromIndex === toIndex', () => {
      useResumeStore.getState().setResume(developerSeed);
      const expSection = useResumeStore
        .getState()
        .resume.sections.find((s) => s.type === 'experience');
      if (!expSection || expSection.items.length === 0) return;
      const firstItemId = expSection.items[0]!.id;
      const before = expSection.items.map((i) => i.id);
      useResumeStore.getState().moveItem(expSection.id, firstItemId, 0);
      const after = useResumeStore.getState().resume.sections.find((s) => s.id === expSection.id);
      expect(after?.items.map((i) => i.id)).toEqual(before);
    });
  });

  it('reset returns to an empty resume', () => {
    useResumeStore.getState().setBasics({ name: 'About to reset' });
    useResumeStore.getState().addSection('experience');
    useResumeStore.getState().reset();
    const r = useResumeStore.getState().resume;
    expect(r.basics.name).toBe('');
    expect(r.sections).toEqual([]);
  });
});

describe('cryptoRandomId', () => {
  it('returns UUIDv4-shaped strings', () => {
    for (let i = 0; i < 5; i++) {
      const id = cryptoRandomId();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    }
  });

  it('returns unique values', () => {
    const ids = new Set(Array.from({ length: 50 }, cryptoRandomId));
    expect(ids.size).toBe(50);
  });
});
