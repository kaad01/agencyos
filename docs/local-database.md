# Local Database Setup

AgencyOS currently ships as a Vite/localStorage prototype. Loop 1 adds the PostgreSQL + Prisma foundation for the planned Next.js + Auth.js migration without breaking the current static demo.

## Prerequisites

- Docker with Compose support
- Node.js 22+
- npm

## Start PostgreSQL

```bash
cp .env.example .env
docker compose up -d postgres
```

The default local database URL is:

```text
postgresql://agencyos:agencyos@localhost:5432/agencyos?schema=public
```

## Validate Prisma schema

```bash
npm run db:validate
```

## Generate Prisma client

```bash
npm run db:generate
```

## Push schema for local development

```bash
npm run db:push
```

## Seed demo data

```bash
npm run db:seed
```

## Open Prisma Studio

```bash
npm run db:studio
```

## Stop PostgreSQL

```bash
docker compose down
```

To delete the local database volume and start clean:

```bash
docker compose down -v
```

## Workspace scoping rule

Every operational model has a `workspaceId`. Future reads and writes must verify that the signed-in user is a member of the active workspace before accessing data.
