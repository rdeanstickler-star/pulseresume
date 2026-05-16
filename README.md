# PulseResume

> Privacy-first, open-source resume builder. Real-time editor. Six templates. ATS-friendly PDF export. No accounts, no telemetry, no server. MIT licensed.

PulseResume is a client-only React 19 + TypeScript SPA modeled on [rxresu.me](https://rxresu.me) and [Reactive Resume v5](https://github.com/AmruthPillai/Reactive-Resume). Your resume lives in your browser's localStorage. Optional URL-fragment sharing. Self-host the whole thing as static files.

## Status

🚧 **Active development.** Milestones complete: 1 (Repo initialization).
See [`./docs/MILESTONES.md`](./docs/MILESTONES.md) (coming in M2) for the live status.

## Features (planned for v1.0.0)

- Real-time side-by-side editor + preview, 120ms input debounce
- Six templates: Classic · Modern · Minimal · Creative · Executive · Technical
- Dual HTML/PDF renderer — same template, two paths, no copy-pasted JSX
- Text-selectable PDF export (A4 + US Letter), ATS-parseable heading structure
- Drag-and-drop section + item reordering (keyboard, touch, mouse)
- Rich text in descriptions (Tiptap: bold, italic, lists, links)
- Customization: 8 palettes + custom hex with WCAG contrast warning, 8 Google fonts, margins, line spacing, section visibility
- JSON import/export, [JSON Resume schema](https://jsonresume.org/schema/) superset
- URL-fragment sharing (compressed, with length + privacy warnings)
- Dark / light / system theme
- WCAG 2.1 AA, screen-reader friendly, keyboard-first
- Mobile editor with bottom-sheet layout

## Tech stack

| Layer            | Choice                                            |
| ---------------- | ------------------------------------------------- |
| Build            | Vite 6 + React 19 + TypeScript 5.7 (strict)       |
| Routing          | React Router v7 (data router, SPA mode)           |
| Styling          | Tailwind CSS + Radix UI + shadcn/ui patterns      |
| State            | Zustand (persist → localStorage) + TanStack Query |
| Forms            | react-hook-form + Zod resolvers                   |
| Rich text        | Tiptap v2                                         |
| Drag and drop    | dnd-kit (keyboard + touch)                        |
| PDF              | @react-pdf/renderer 4                             |
| Icons            | lucide-react                                      |
| Validation       | Zod 3                                             |
| Tests            | Vitest + React Testing Library + Playwright       |
| Runtime          | Node 22 LTS, pnpm 9                               |

## Getting started

Prerequisites: Node 22+, pnpm 9+ (via [Corepack](https://nodejs.org/api/corepack.html): `corepack enable && corepack prepare pnpm@9.15.0 --activate`).

```bash
git clone https://github.com/<you>/pulseresume.git
cd pulseresume
pnpm install
pnpm dev
```

The dev server runs at <http://localhost:5173>.

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
pnpm test:e2e         # playwright
pnpm format           # prettier --write
```

## Privacy

PulseResume makes **zero outbound requests** except:

- Google Fonts CDN at runtime, for the fonts you choose
- Optional anonymous-only telemetry to `npmjs.com` (your install step, not ours)

No analytics. No tracking pixels. No cloud sync. No auth. The only data we ever touch is what you type, and it lives in `localStorage` under the key `pulseresume:v1`. URL-fragment sharing is opt-in and clearly labeled as unencrypted.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md). Issues and PRs welcome.

## License

[MIT](./LICENSE) — do whatever you want, including commercial use. Attribution appreciated but not required.

## Acknowledgements

Inspired by [rxresu.me](https://rxresu.me) and [Reactive Resume](https://github.com/AmruthPillai/Reactive-Resume) (also MIT). PulseResume is an independent reimplementation, not a fork.
