import { describe, expect, it } from 'vitest';
import {
  buildShareUrl,
  decodeShareFragment,
  encodeShareFragment,
  FRAGMENT_WARN_AT,
} from './url-share';
import { developerSeed } from '@/schema/seeds/developer';

describe('encodeShareFragment', () => {
  it('starts with #data=', () => {
    const fragment = encodeShareFragment(developerSeed);
    expect(fragment).toMatch(/^#data=/);
  });
  it('produces URI-safe output (no chars that need encodeURIComponent)', () => {
    const fragment = encodeShareFragment(developerSeed);
    // After the #, characters should match URI-safe set
    expect(fragment.slice(1)).toMatch(/^[A-Za-z0-9$+\-_.!*'()=]+$/);
  });
  it('round-trips through decodeShareFragment', () => {
    const fragment = encodeShareFragment(developerSeed);
    const result = decodeShareFragment(fragment);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.resume).toEqual(developerSeed);
  });
});

describe('buildShareUrl', () => {
  it('prefixes the base URL', () => {
    const url = buildShareUrl(developerSeed, 'https://example.com/editor');
    expect(url).toMatch(/^https:\/\/example\.com\/editor#data=/);
  });
});

describe('decodeShareFragment', () => {
  it('returns isMissing flag for empty input', () => {
    const result = decodeShareFragment('');
    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as { isMissing?: true }).isMissing).toBe(true);
  });
  it('returns isMissing flag when no data= key is present', () => {
    const result = decodeShareFragment('#otherkey=abc');
    expect(result.ok).toBe(false);
    if (!result.ok) expect((result as { isMissing?: true }).isMissing).toBe(true);
  });
  it('rejects garbled / non-LZ-string data', () => {
    const result = decodeShareFragment('#data=not-a-valid-compressed-blob');
    // lz-string may successfully "decompress" garbage as empty or invalid JSON
    expect(result.ok).toBe(false);
  });
  it('accepts a full URL with a fragment, not just a fragment', () => {
    const url = buildShareUrl(developerSeed, 'https://example.com/editor');
    const result = decodeShareFragment(url);
    expect(result.ok).toBe(true);
  });
});

describe('FRAGMENT_WARN_AT', () => {
  it('is set to a reasonable browser-safe URL threshold', () => {
    expect(FRAGMENT_WARN_AT).toBeGreaterThan(2000);
    expect(FRAGMENT_WARN_AT).toBeLessThan(10000);
  });
});
