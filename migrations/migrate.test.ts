import { describe, expect, it } from 'vitest';
import { migrate, MIGRATIONS, validate, safeValidate } from './index';
import { v0ToV1 } from './001-bootstrap';
import { SCHEMA_VERSION } from '../src/schema/resume';
import { developerSeed } from '../src/schema/seeds/developer';

describe('migration chain', () => {
  it('chain is contiguous: every step.to === next.from, ending at SCHEMA_VERSION', () => {
    let expected = MIGRATIONS[0]?.from;
    for (const step of MIGRATIONS) {
      expect(step.from, 'gap in chain').toBe(expected);
      expect(step.to, 'step does not advance by one').toBe(step.from + 1);
      expected = step.to;
    }
    expect(expected, 'chain does not end at SCHEMA_VERSION').toBe(SCHEMA_VERSION);
  });

  it('exports v0ToV1 as the first migration', () => {
    expect(MIGRATIONS[0]).toBe(v0ToV1);
    expect(v0ToV1.from).toBe(0);
    expect(v0ToV1.to).toBe(1);
  });
});

describe('migrate()', () => {
  it('upgrades a v0 (no schemaVersion) doc by stamping schemaVersion: 1', () => {
    const v0 = {
      meta: {},
      basics: { name: 'Migrator' },
      sections: [],
    };
    const result = migrate(v0);
    expect(result.schemaVersion).toBe(1);
    expect(result.basics.name).toBe('Migrator');
  });

  it('passes through a doc that is already at SCHEMA_VERSION', () => {
    const result = migrate(developerSeed);
    expect(result).toEqual(developerSeed);
  });

  it('rejects a doc with a newer schemaVersion (forward-incompatible)', () => {
    expect(() => migrate({ schemaVersion: 999, meta: {}, basics: {}, sections: [] })).toThrowError(
      /newer than this build/,
    );
  });

  it('rejects non-object input', () => {
    expect(() => migrate(null)).toThrow(TypeError);
    expect(() => migrate('a string')).toThrow(TypeError);
    expect(() => migrate(42)).toThrow(TypeError);
  });

  it('rejects a doc with a non-integer schemaVersion', () => {
    expect(() => migrate({ schemaVersion: '1', meta: {}, basics: {}, sections: [] })).toThrow(
      /Invalid schemaVersion/,
    );
    expect(() => migrate({ schemaVersion: 1.5, meta: {}, basics: {}, sections: [] })).toThrow(
      /Invalid schemaVersion/,
    );
  });

  it('reports validation errors with field paths after migration', () => {
    const bogus = {
      schemaVersion: 1,
      meta: {},
      basics: { email: 'not an email' },
      sections: [],
    };
    expect(() => migrate(bogus)).toThrow(/email/);
  });
});

describe('validate() / safeValidate()', () => {
  it('validate() passes a known-good resume', () => {
    expect(() => validate(developerSeed)).not.toThrow();
  });

  it('validate() throws on a known-bad resume', () => {
    expect(() => validate({ nope: true })).toThrow();
  });

  it('safeValidate() returns success: true on a known-good resume', () => {
    const result = safeValidate(developerSeed);
    expect(result.success).toBe(true);
  });

  it('safeValidate() returns success: false on a bad resume without throwing', () => {
    const result = safeValidate({ nope: true });
    expect(result.success).toBe(false);
  });
});

describe('v0ToV1 migration unit', () => {
  it('throws on null input', () => {
    expect(() => v0ToV1.migrate(null as unknown as Record<string, unknown>)).toThrow(TypeError);
  });

  it('throws on primitive input', () => {
    expect(() => v0ToV1.migrate('hi' as unknown as Record<string, unknown>)).toThrow(TypeError);
  });

  it('preserves all existing fields when stamping schemaVersion', () => {
    const result = v0ToV1.migrate({ foo: 'bar', nested: { x: 1 } });
    expect(result).toEqual({ foo: 'bar', nested: { x: 1 }, schemaVersion: 1 });
  });

  it('overwrites an existing schemaVersion on the way through', () => {
    const result = v0ToV1.migrate({ schemaVersion: 99, foo: 'preserved' });
    expect(result).toEqual({ foo: 'preserved', schemaVersion: 1 });
  });
});
