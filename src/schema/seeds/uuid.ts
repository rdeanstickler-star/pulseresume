/**
 * Stable UUID helper for seed resumes.
 *
 * Why stable IDs in seeds: tests, snapshots, and "load example" UX should
 * produce identical documents each run. `crypto.randomUUID()` doesn't give us
 * that. We hand-pick UUIDv4-shaped values per seed item.
 *
 * Seeds use the prefix `00000000-0000-4xxx-yxxx-xxxxxxxxxxxx` to make them
 * easy to recognize in dev tools ("oh, that's a seed item").
 */

/** Build a deterministic UUIDv4 from a numeric counter. Range: 0–9999. */
export function seedId(seed: number): string {
  const padded = seed.toString(16).padStart(12, '0').toUpperCase();
  return `00000000-0000-4000-8000-${padded}`.toLowerCase();
}
