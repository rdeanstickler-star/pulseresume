# Changelog

All notable changes to PulseResume are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] — 2026-07-10

### Fixed

- "View on GitHub" links (header icon + home hero) pointed at bare `https://github.com/`. Both now render only when `GITHUB_REPO_URL` in `src/config.ts` is set — set it once the repository is published.
- Added `public/_redirects` (`/* /index.html 200`) so Netlify deploys serve deep links like `/editor` on hard load; previously the SPA fallback existed only in the deployed bundle, not in source, so fresh builds would have regressed it.

## [1.0.0] — 2026-05-16

Initial public release. PulseResume is a privacy-first, MIT-licensed, open-source resume builder modeled on [rxresu.me](https://rxresu.me) and [Reactive Resume v5](https://github.com/AmruthPillai/Reactive-Resume) — built as an independent reimplementation from scratch on Vite + React 19 + TypeScript strict.

### Added

#### Editor experience

- Two-pane responsive editor — sectioned form on the left, live preview on the right.
- Mobile bottom-sheet swap below 768 px (Edit / Preview tabs).
- 120 ms debounced input commits — typing-fast doesn't thrash the store or re-validate mid-word.
- Zustand store with `persist` middleware → `localStorage` key `pulseresume:v1`.
- Automatic schema migration on hydrate — older or JSON-Resume-shaped documents lift to the current shape.
- Three seed resumes loadable from a dropdown: Staff Software Engineer · Senior Product Designer · Chief Revenue Officer.
- Reset and Load Example controls in the toolbar.
- Tiptap rich-text editor (bold, italic, ordered + unordered lists, links) ready for use in section item editors.

#### Schema

- 14 section types via a Zod discriminated union: profile, summary, experience, education, skills, languages, awards, certifications, publications, volunteering, references, projects, interests, custom.
- Every section has id, name, visible, columns, items. Every item has an id and a visible flag.
- Strict-superset of [JSON Resume v1.0.0](https://jsonresume.org/schema/) — every deviation documented in `src/schema/JSON_RESUME_ALIGNMENT.md`.
- Migration chain plumbing (`migrations/`) is real code — v0 → v1 bootstrap stamps schemaVersion on un-versioned imports.

#### Templates

- Six visually distinct templates, all dual-rendered to HTML preview AND `@react-pdf/renderer` PDF export through a shared `TokenSet` contract and shared section renderers:
  - **Classic** — single column, sans-serif, ATS-friendly default
  - **Modern** — accent stripe + inline-bar section headings
  - **Minimal** — generous whitespace, no rules
  - **Creative** — full-width color-block hero
  - **Executive** — centered serif, top + bottom ruled section dividers
  - **Technical** — monospace headings with `[ SECTION ]` brackets

#### Customization

- 8 curated AA-compliant palettes (Slate, Navy, Forest, Crimson, Plum, Teal, Sky, Amber).
- 3 hex pickers (Text · Accent · Background) with native color inputs + live WCAG 2.1 contrast meter (`14.7 : 1 · AAA`).
- 8 Google Fonts via Fontsource CDN: Inter, Roboto, Lato, Merriweather, Source Serif Pro, Playfair Display, EB Garamond, JetBrains Mono. PDF-registered families flagged.
- Body size, line-height, and 4 margin sliders.

#### Drag-and-drop (dnd-kit)

- Section reordering and item-within-section reordering.
- Three sensors: pointer (4 px), touch (200 ms long-press), keyboard (Tab → Space → Arrows → Space/Esc).
- Custom announcements feed dnd-kit's live region with real section / item names for assistive tech.
- Up/down arrow buttons retained as deterministic a11y fallback.

#### Import / export / sharing

- PDF export (A4 + US Letter) — text-selectable, real headings for ATS, real bullets, real links.
- JSON export — pretty-printed JSON Resume superset, slugified filename (`avery-chen-resume.json`).
- JSON import — file picker → Zod parse → migrate() → store. Errors surface with specific field paths.
- URL-fragment sharing — `lz-string` compressed JSON in `#data=...`. Character count + "unencrypted" warning surfaced inline. Auto-imports on first load with the fragment.
- All paths client-only. No upload, no server, no telemetry.

#### Theming

- Light / Dark / System theme toggle in the header, persisted independently of the resume.
- `prefers-reduced-motion` respect site-wide.

#### Accessibility (WCAG 2.1 AA)

- Skip-to-content link, focus-visible rings, aria-labels on every icon button.
- All forms labelled, `role="alert"` for validation errors, screen-reader-friendly drag announcements.
- axe-core / Playwright audit on HomePage + Editor — zero violations.

### Testing

- **197 Vitest specs** in 18 files — schema, migrations, store, hooks, formatters, WCAG, JSON I/O, URL share, editor RTL.
- Coverage above the 80 / 75 / 80 / 80 thresholds (94.77 / 88.69 / 87.03 / 94.77).
- **2 Playwright specs** on Chromium — smoke (launch → seed → edit → switch template → export PDF) and a11y (axe-core HomePage + Editor).

### Tech stack

- Vite 6 + React 19 + TypeScript 5.7 strict
- React Router v7 SPA mode
- Tailwind CSS 3.4 + Radix UI + shadcn patterns
- Zustand 5 + TanStack Query 5
- dnd-kit · Tiptap · @react-pdf/renderer 4
- Zod 3 · react-hook-form 7
- Vitest 2 + React Testing Library + Playwright 1
- Node 22 LTS · pnpm 9

### Privacy

- No outbound calls except the Google Fonts CDN at `fonts.googleapis.com` / `fonts.gstatic.com` (one preconnect + one stylesheet) — used by the customization font picker.
- All resume data persists in `localStorage` under `pulseresume:v1`. URL sharing is opt-in, labeled "unencrypted", and never leaves the browser.

[1.0.0]: https://github.com/<you>/pulseresume/releases/tag/v1.0.0
