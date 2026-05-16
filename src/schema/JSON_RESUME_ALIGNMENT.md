# JSON Resume Alignment

PulseResume's v1 schema is intentionally a **superset** of [JSON Resume v1.0.0](https://jsonresume.org/schema/). We accept and emit JSON Resume documents, but we add structural metadata that JSON Resume doesn't carry.

This document tracks every intentional deviation.

## Why deviate at all

JSON Resume is a flat dictionary keyed by section name (`work`, `education`, `awards`, ...). That's fine for storage but doesn't capture:

- **Section ordering** — JSON Resume implies an order via key order, which is unreliable across JSON parsers
- **Section visibility** — Users want to hide sections without deleting their content
- **Section renaming** — "Work" might be "Career" or "Professional Experience" depending on industry
- **Column layout** — Two-column sections (skills + languages side-by-side) aren't representable
- **Custom sections** — Side projects, speaking engagements, board memberships, etc.

PulseResume models all of these explicitly via `sections[]` — an ordered list of typed section objects, each with `id`, `name`, `type`, `visible`, `columns`, and `items[]`.

## Structural deviations

| JSON Resume                                | PulseResume                                                   | Reason                                                       |
| ------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------ |
| Flat dictionary (`work`, `education`, ...) | `sections[]` ordered array                                    | Explicit ordering + reorder support                          |
| `basics.profiles[]`                        | A `profile` section with `items[]`                            | Profile links are a renderable section, not header metadata  |
| No section-level metadata                  | `id`, `name`, `visible`, `columns` on every section           | Layout + hide/show + rename                                  |
| Implicit summary inside `basics.summary`   | Optional `summary` section (single-item) AND `basics.summary` | Lets users put their summary inline OR as a standalone block |
| No project status                          | `projects[].current: boolean`                                 | Common case ("ongoing project")                              |
| No item-level visibility                   | `visible: boolean` on every item                              | Drafting / season-specific content                           |

## Field-level changes

| Field                      | JSON Resume   | PulseResume                                         | Notes                                                               |
| -------------------------- | ------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| `basics.label`             | string        | `basics.headline`                                   | Renamed for clarity ("headline" matches LinkedIn / common parlance) |
| `basics.image`             | URL string    | `basics.photo.{url,visible}`                        | Defaults `visible: false` for ATS-friendly resumes                  |
| Date format                | `YYYY-MM-DD`  | `YYYY` \| `YYYY-MM` \| `YYYY-MM-DD`                 | Resumes don't always know the day                                   |
| `summary` (work/education) | string        | `summary` (rich HTML)                               | Rich text from Tiptap (bold, italic, lists, links)                  |
| `keywords[]`               | `string[]`    | `string[]`                                          | Same                                                                |
| `highlights[]`             | `string[]`    | `string[]`                                          | Same                                                                |
| `skills[].level`           | string (free) | enum: novice/beginner/intermediate/advanced/expert  | Standardized for filterability                                      |
| `languages[].fluency`      | string (free) | enum: elementary/limited/professional/fluent/native | CEFR-adjacent standardization                                       |

## Sections present in PulseResume, not in JSON Resume

- `interests` (JSON Resume has it, but underspecified — we add `keywords[]`)
- `references` (JSON Resume has it; we add `position` and `contact`)
- `custom` (free-form user-defined section)

## Sections in JSON Resume, not in PulseResume

None — every JSON Resume top-level key has a PulseResume equivalent section type.

## Import path (JSON Resume → PulseResume)

The `migrations/v0-json-resume.ts` migration (built in M8 when import lands) walks the flat JSON Resume structure and produces a PulseResume document with:

- `schemaVersion: 1`
- `basics` extracted from JSON Resume's `basics` (minus `profiles`)
- `sections[]` built by walking `work`, `volunteer`, `education`, `awards`, `certificates`, `publications`, `skills`, `languages`, `interests`, `references`, `projects` in that order
- A `profile` section synthesized from `basics.profiles[]`
- All sections get `visible: true`, `columns: 1`, default UUIDs

## Export path (PulseResume → JSON Resume)

The inverse — `lib/json-resume-export.ts` (built in M8) emits a flat JSON Resume v1.0.0 document. Sections with `visible: false` are excluded. Sections with `columns: 2` or `name` differing from defaults round-trip via PulseResume-specific extensions namespaced under `x-pulseresume`. JSON Resume validators ignore unknown keys, so the export is a strict superset.

---

**TL;DR for contributors:** if a field exists in JSON Resume, prefer the same name in PulseResume. If we add structure JSON Resume doesn't have, document it here and namespace the export with `x-pulseresume.*`.
