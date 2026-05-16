# Contributing to PulseResume

Thanks for considering a contribution. PulseResume is small, opinionated, and intentionally scoped — please read this first.

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm test         # unit tests in watch mode: pnpm test:watch
pnpm lint && pnpm typecheck
```

Pre-commit hooks (Husky + lint-staged) run `eslint --fix` and `prettier --write` on staged files. Don't disable them.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Examples:

- `feat(editor): add 120ms input debounce`
- `fix(pdf): register Inter Bold variant before page render`
- `refactor(schema): extract section discriminated union`
- `test(migrations): cover v1→v1 no-op pass`
- `docs(readme): add screenshot of Technical template`
- `chore(deps): bump dnd-kit to 6.3.2`

## PR checklist

Before opening a PR, make sure:

- [ ] `pnpm typecheck` passes (zero errors)
- [ ] `pnpm lint` passes (zero errors, warnings reviewed)
- [ ] `pnpm test` passes
- [ ] New behavior has tests (unit, integration, or e2e as appropriate)
- [ ] Schema or migration changes include a migration file and updated tests
- [ ] User-facing changes include a screenshot or short GIF in the PR description
- [ ] No `console.log` left behind (`console.warn`/`console.error` are fine)
- [ ] Accessibility: keyboard reachable + tested with screen reader for non-trivial UI

## Architecture invariants

These are non-negotiable. If your change conflicts with one, open an issue first.

1. **Client-only.** No SSR. No server. The app must run as static files.
2. **Privacy.** No outbound calls except Google Fonts CDN. No analytics.
3. **Dual render.** Templates render to both HTML (preview) and `@react-pdf/renderer` primitives (export). Tokens extracted; no JSX copy-paste.
4. **Schema is the source of truth.** Every state mutation parses through Zod. Invalid states are unrepresentable.
5. **A11y is shipped, not bolted on.** Every interactive element keyboard-reachable, every status change announced.

## Scope

PulseResume v1 is feature-complete with the list in the README. Out of scope until further notice: optional auth, Docker self-host, AI rewrite, password-protected share links, resume scoring. Please don't open feature requests for those yet — they have a parked roadmap.

## License

By contributing, you agree your contribution is licensed under the [MIT License](./LICENSE).
