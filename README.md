# PulseResume

> Privacy-first, open-source resume builder. Real-time editor. Six templates. ATS-friendly PDF export. No accounts, no telemetry, no server. MIT licensed.

PulseResume is a client-only React 19 + TypeScript SPA modeled on [rxresu.me](https://rxresu.me) and [Reactive Resume v5](https://github.com/AmruthPillai/Reactive-Resume) — built as an independent reimplementation from scratch. Your resume lives in your browser's localStorage. Optional URL-fragment sharing. Self-host as static files.

## Status

✅ **v1.0.0 — Ready.** Eleven feature milestones complete, 197 unit specs, 2 Playwright specs (smoke + axe-core a11y), all CI gates green. See [`CHANGELOG.md`](./CHANGELOG.md) for the v1.0.0 release notes.

## Features

### Editor

- **Real-time** side-by-side editor + preview with 120 ms input debounce.
- **Mobile responsive** — collapses to Edit/Preview tabs on narrow viewports.
- **Persisted** to `localStorage`. Reload-safe, with migration plumbing for older schema versions.
- **Three seed resumes** loadable for inspiration (developer, designer, executive).

### Six templates

Each template is dual-rendered to HTML preview AND PDF export through a shared `TokenSet` contract and shared section renderers. Change content once, both paths update.

| Template      | Identity                                                      |
| ------------- | ------------------------------------------------------------- |
| **Classic**   | Single column · sans-serif · ATS-friendly default             |
| **Modern**    | Accent stripe · vivid headings · sans-serif                   |
| **Minimal**   | Generous whitespace · no rules · serif-quiet sans             |
| **Creative**  | Color-block hero · accent headings · sans-serif               |
| **Executive** | Centered serif · ruled dividers · formal                      |
| **Technical** | Monospace headings · compact density · `[ SECTION ]` brackets |

### Customization

- **8 curated AA-compliant palettes** + 3 hex pickers with live WCAG 2.1 contrast meter.
- **8 Google Fonts** (Inter, Roboto, Lato, Merriweather, Source Serif Pro, Playfair Display, EB Garamond, JetBrains Mono).
- Body size, line-height, and 4 margin sliders.

### Drag and drop (dnd-kit)

- Section reordering and item-within-section reordering.
- Keyboard (Tab → Space → Arrows → Space/Esc), touch (long-press), mouse.
- Custom live-region announcements for screen readers.
- Up/down arrow buttons retained as deterministic a11y fallback.

### Import / export / sharing

- **PDF** — A4 or US Letter, text-selectable, real heading hierarchy for ATS parsers.
- **JSON** — exports a JSON-Resume v1.0.0 superset; import re-validates and migrates.
- **URL share** — `lz-string` compressed JSON in `#data=…` with live character count + "unencrypted" warning. Auto-imports on first load if the fragment is present.

### Schema

- 14 section types via a Zod discriminated union: profile, summary, experience, education, skills, languages, awards, certifications, publications, volunteering, references, projects, interests, custom.
- Strict superset of [JSON Resume v1.0.0](https://jsonresume.org/schema/); deviations documented in [`src/schema/JSON_RESUME_ALIGNMENT.md`](./src/schema/JSON_RESUME_ALIGNMENT.md).
- Migration chain plumbing real from v1, ready to grow.

### Accessibility — WCAG 2.1 AA

- axe-core / Playwright audit on HomePage + Editor → **zero violations**.
- Skip-to-content link, focus-visible rings, aria-labels on every icon button.
- `prefers-reduced-motion` respected site-wide.
- Light / dark / system theme toggle.

## Tech stack

| Layer         | Choice                                                     |
| ------------- | ---------------------------------------------------------- |
| Build         | Vite 6 + React 19 + TypeScript 5.7 (strict)                |
| Routing       | React Router v7 (SPA mode)                                 |
| Styling       | Tailwind CSS 3.4 + Radix UI + shadcn patterns              |
| State         | Zustand 5 (persist → localStorage) + TanStack Query 5      |
| Forms         | react-hook-form 7 + Zod 3                                  |
| Rich text     | Tiptap 2                                                   |
| Drag and drop | dnd-kit                                                    |
| PDF           | @react-pdf/renderer 4                                      |
| Icons         | lucide-react                                               |
| Tests         | Vitest 2 + React Testing Library + Playwright 1 + axe-core |
| Runtime       | Node 22 LTS · pnpm 9                                       |

## Getting started

```bash
git clone https://github.com/<you>/pulseresume.git
cd pulseresume
pnpm install
pnpm dev
```

The dev server runs at <http://localhost:5173>. First-time Playwright users also need `pnpm playwright install chromium` before running e2e tests.

### Scripts

```bash
pnpm dev              # Vite dev server, HMR
pnpm build            # typecheck + production bundle
pnpm preview          # serve the production bundle locally
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run
pnpm test:watch       # vitest in watch mode
pnpm test:coverage    # vitest with v8 coverage
pnpm test:e2e         # playwright (smoke + a11y)
pnpm test:ci          # lint + typecheck + vitest + playwright (full gate)
pnpm format           # prettier --write
```

## Privacy

PulseResume makes **zero outbound requests** except a Google Fonts CDN load (`fonts.googleapis.com` + `fonts.gstatic.com`) for the customization font picker. No analytics. No tracking pixels. No cloud sync. No authentication. Your resume data lives in `localStorage` under `pulseresume:v1`. URL-fragment sharing is opt-in and clearly labeled as unencrypted.

## Architecture invariants

These are non-negotiable. If your contribution conflicts with one, open an issue first.

1. **Client-only.** No SSR. No server. The app must run as static files.
2. **Privacy.** No outbound calls except Google Fonts CDN. No analytics.
3. **Dual render.** Templates render to both HTML (preview) and `@react-pdf/renderer` primitives (export). Tokens extracted; no JSX duplication.
4. **Schema is the source of truth.** Every state mutation parses through Zod. Invalid states are unrepresentable.
5. **A11y is shipped, not bolted on.** Every interactive element is keyboard reachable; every status change is announced.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md). Issues and PRs welcome.

## License

[MIT](./LICENSE) — do whatever you want, including commercial use. Attribution appreciated but not required.

## Acknowledgements

Inspired by [rxresu.me](https://rxresu.me) and [Reactive Resume](https://github.com/AmruthPillai/Reactive-Resume) (also MIT). PulseResume is an independent reimplementation, not a fork.
