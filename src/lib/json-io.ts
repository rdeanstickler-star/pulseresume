import { migrate } from '../../migrations';
import type { Resume } from '@/schema/resume';

/**
 * JSON import/export helpers for the resume.
 *
 * Export: pretty-printed JSON ready to download. The shape is a strict
 * superset of JSON Resume v1.0.0; non-JSON-Resume fields live under
 * familiar names (`sections`, `meta.template`, etc.) so a stripped JSON
 * Resume parser can still read the basics.
 *
 * Import: text → JSON.parse → migrate() → validated Resume. Errors are
 * returned as a discriminated union so the UI can surface a specific
 * message instead of throwing.
 */

export function exportJson(resume: Resume): string {
  return JSON.stringify(resume, null, 2);
}

export type ImportResult = { ok: true; resume: Resume } | { ok: false; error: string };

export function importJson(text: string): ImportResult {
  if (!text.trim()) {
    return { ok: false, error: 'Empty file or pasted text.' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON';
    return { ok: false, error: `JSON parse error: ${msg}` };
  }
  try {
    const resume = migrate(parsed);
    return { ok: true, resume };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Validation failed';
    return { ok: false, error: msg };
  }
}

/**
 * Trigger a browser download of `text` as `filename`. Uses a transient
 * object URL so nothing lingers in memory.
 */
export function downloadText(text: string, filename: string, mimeType = 'application/json'): void {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Sensible JSON filename from a resume's name. */
export function buildJsonFilename(resume: Resume): string {
  const raw = resume.basics.name.trim() || 'resume';
  const slug = raw
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'resume'}-resume.json`;
}
