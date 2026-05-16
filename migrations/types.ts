/**
 * Migration contract. Every migration moves a document from one schema version
 * to the next. Migrations are pure (no I/O, no mutation of input). They run in
 * a chain assembled by `migrate()`.
 */

export interface Migration<TFrom = unknown, TTo = unknown> {
  /** Schema version this migration starts from. */
  from: number;
  /** Schema version this migration ends at. Must be `from + 1`. */
  to: number;
  /** Human description for changelog + errors. */
  description: string;
  /** Pure transformation. Throw if input is unrecognizable. */
  migrate(data: TFrom): TTo;
}
