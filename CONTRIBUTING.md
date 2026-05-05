# Contributing to AgencyOS

Thanks for wanting to help. AgencyOS is early, which means good contributions can shape the product a lot.

## Product direction

AgencyOS is an open-source operating system for consulting agencies. The core workflow is:

```text
customers → projects → tickets → team assignments → time tracking → reports
```

Before adding large new modules, check whether the change strengthens that loop.

## Good first contribution areas

- Fix UI rough edges and responsive states.
- Improve empty/loading/error states.
- Add tests for domain calculations.
- Improve docs and setup instructions.
- Help migrate the app from Vite/localStorage to Next.js/PostgreSQL/Prisma/Auth.js.
- Add database-backed CRUD for customers, projects, tickets, team, and time entries.

## Local setup

```bash
npm install
npm run dev
```

For database work:

```bash
cp .env.example .env
docker compose up -d postgres
npm run db:validate
npm run db:generate
npm run db:push
npm run db:seed
```

## Quality gates

Run these before opening a PR:

```bash
npm run db:validate
npm run lint
npm run test
npm run build
```

If Docker is required for your change, also verify the local Postgres workflow.

## Pull request style

Please keep PRs focused and reviewable.

A good PR includes:

- Clear summary of the user-facing change.
- Screenshots or GIFs for UI changes.
- Notes about migrations/config changes.
- Checks run.
- Any known follow-up work.

## Design principles

- Calm, useful, uncluttered UI.
- Agency workflow before generic project management.
- Boring, contributor-friendly architecture.
- Workspace-scoped data access.
- No complex permissions until simple roles are working.

## Architecture notes

Target stack:

- Next.js App Router + TypeScript
- PostgreSQL
- Prisma
- Auth.js / NextAuth
- Tailwind + shadcn/Radix-style primitives
- Vitest + Playwright

See:

- `docs/architecture.md`
- `docs/tech-stack-decision.md`
- `docs/implementation-roadmap.md`
- `docs/development-workflow.md`

## Code of conduct

Be kind, direct, and practical. We are here to build a useful open-source product, not win arguments.
