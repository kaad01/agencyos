# AgencyOS Architecture

## Principle

Build one boring modular monolith first. AgencyOS should be easy for open-source contributors to run, understand, and extend.

## Current prototype

- React + Vite
- Browser localStorage persistence
- Domain logic in `src/domain.ts`
- Functional modules in `src/App.tsx`
- No backend yet

This is intentionally fast for product discovery, not the final architecture.

## Target architecture

```text
apps/web
  app UI + server/API routes
packages/domain
  shared types, validation, calculations
packages/db
  schema, migrations, seed data
packages/ui
  reusable UI components
```

## Core modules

### Customers

Own projects and reporting context.

### Projects

Anchor object. Contains customer link, lead, budget, rate, status, dates, team, tickets, and time.

### Tickets

Trello-like execution layer. Tickets move through statuses and are assigned to colleagues.

### Time

Clockify-like manual time entries against projects and tickets.

### Reports

Aggregations over time, project, customer, team, billable status, and budget.

### Team

Colleagues, roles, capacity, rates, assignments, and workload.

## Initial database entities

- Workspace
- User
- Customer
- Project
- ProjectMember
- Ticket
- TimeEntry
- ReportPreset

## Open-source requirements

- `.env.example`
- Docker Compose for app + Postgres
- Seed script
- Migrations
- Contribution guide
- Issue and PR templates
- CI for lint, test, build

## Near-term migration plan

1. Finish localStorage product workflow prototype.
2. Split domain logic and UI components.
3. Add route-based pages.
4. Introduce database schema and seed data.
5. Add auth/workspaces.
6. Move Vercel deployment to GitHub-backed CI/CD.
