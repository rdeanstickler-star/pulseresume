import { resume, SCHEMA_VERSION, type Resume } from '../src/schema/resume';
import { v0ToV1 } from './001-bootstrap';
import type { Migration } from './types';

/**
 * Migration chain. Add new entries at the end. The chain MUST be contiguous
 * (each migration's `to` equals the next one's `from`).
 */
export const MIGRATIONS: ReadonlyArray<Migration> = [v0ToV1];

/**
 * Read the schemaVersion from a candidate document. Returns 0 if the field is
 * missing (treated as "pre-v1, needs bootstrap").
 */
function readSchemaVersion(data: unknown): number {
  if (data === null || typeof data !== 'object') {
    throw new TypeError('Expected an object, got ' + typeof data);
  }
  const record = data as { schemaVersion?: unknown };
  if (record.schemaVersion === undefined) return 0;
  if (typeof record.schemaVersion !== 'number' || !Number.isInteger(record.schemaVersion)) {
    throw new TypeError(
      `Invalid schemaVersion: ${JSON.stringify(record.schemaVersion)} (expected integer)`,
    );
  }
  return record.schemaVersion;
}

/**
 * Run the migration chain starting from the document's declared version up to
 * the current `SCHEMA_VERSION`. Returns a validated `Resume`.
 *
 * Throws if:
 *  - input is not an object
 *  - declared version is newer than supported (forward-incompatible)
 *  - any migration step throws (malformed shape)
 *  - the final document fails Zod validation
 */
export function migrate(data: unknown): Resume {
  const startVersion = readSchemaVersion(data);

  if (startVersion > SCHEMA_VERSION) {
    throw new RangeError(
      `Document schemaVersion ${startVersion} is newer than this build (${SCHEMA_VERSION}). ` +
        `Update PulseResume to read it.`,
    );
  }

  let current: unknown = data;
  let currentVersion = startVersion;

  while (currentVersion < SCHEMA_VERSION) {
    const step = MIGRATIONS.find((m) => m.from === currentVersion);
    if (!step) {
      throw new Error(
        `No migration found from schemaVersion ${currentVersion}. ` +
          `Chain is broken or version is unknown.`,
      );
    }
    current = step.migrate(current);
    currentVersion = step.to;
  }

  const parsed = resume.safeParse(current);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .slice(0, 5)
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(
      `Document failed schema validation after migration:\n${issues}` +
        (parsed.error.issues.length > 5 ? `\n  …and ${parsed.error.issues.length - 5} more` : ''),
    );
  }
  return parsed.data;
}

/**
 * Validate a document is exactly v1-shaped without running the migration
 * chain. Used by tests and by the store's mutation validator (no migration
 * needed on already-loaded state).
 */
export function validate(data: unknown): Resume {
  return resume.parse(data);
}

/**
 * Same as `validate` but returns the SafeParseReturnType for callers that
 * want to surface validation errors in the UI rather than throw.
 */
export function safeValidate(data: unknown): ReturnType<typeof resume.safeParse> {
  return resume.safeParse(data);
}
