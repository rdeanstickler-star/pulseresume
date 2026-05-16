import LZString from 'lz-string';
import { migrate } from '../../migrations';
import type { Resume } from '@/schema/resume';

/**
 * URL-fragment sharing. Compresses the resume JSON with lz-string's
 * URI-safe Base64 variant and embeds it in `#data=...`. Browsers don't
 * send the fragment to servers, so this stays client-only — but the data
 * IS visible to anyone with the link. We surface that explicitly in the UI.
 *
 * Length math: most browsers handle ~8 KB URLs comfortably. We start
 * warning at 6 K characters in the URL fragment, hard-cap nowhere — the
 * UI lets users proceed at their own risk.
 */

const FRAGMENT_KEY = 'data';
export const FRAGMENT_WARN_AT = 6000;
export const FRAGMENT_HARD_LIMIT = 8000;

/**
 * Encode a resume into a URL fragment. Returns the fragment string
 * (including the `#`). The current page's pathname is up to the caller —
 * usually `${location.origin}/editor#data=...`.
 */
export function encodeShareFragment(resume: Resume): string {
  const json = JSON.stringify(resume);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return `#${FRAGMENT_KEY}=${compressed}`;
}

/** Convenience: full URL using `location` if available. Pure when location is supplied. */
export function buildShareUrl(resume: Resume, baseUrl?: string): string {
  const base = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin + '/editor' : '');
  return `${base}${encodeShareFragment(resume)}`;
}

export type ShareDecodeResult =
  | { ok: true; resume: Resume }
  | { ok: false; error: string }
  | { ok: false; error: 'missing'; isMissing: true };

/**
 * Decode the active `location.hash`. Returns `{ ok: false, error: 'missing' }`
 * if no fragment data is present, distinct from `{ ok: false, error: '...' }`
 * for actual decode failures.
 */
export function decodeShareFragment(hashOrUrl?: string): ShareDecodeResult {
  const source = hashOrUrl ?? (typeof window !== 'undefined' ? window.location.hash : '');
  if (!source) return { ok: false, error: 'missing', isMissing: true };
  // Accept either a bare hash ("#data=...") or a full URL.
  const hash = source.startsWith('#') ? source : source.slice(source.indexOf('#'));
  if (!hash) return { ok: false, error: 'missing', isMissing: true };
  const match = new RegExp(`[#&]${FRAGMENT_KEY}=([^&]+)`).exec(hash);
  if (!match) return { ok: false, error: 'missing', isMissing: true };
  const compressed = match[1]!;
  const json = LZString.decompressFromEncodedURIComponent(compressed);
  if (!json) {
    return { ok: false, error: 'Could not decompress share data — link may be truncated.' };
  }
  try {
    const parsed = JSON.parse(json) as unknown;
    const resume = migrate(parsed);
    return { ok: true, resume };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Validation failed';
    return { ok: false, error: msg };
  }
}
