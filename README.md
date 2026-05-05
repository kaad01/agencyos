# AgencyOS

AgencyOS is an open-source consulting agency operating system: projects, tickets, team assignments, time tracking, customers, and reports in one calm workspace.

The product direction is inspired by focused agency tools like MOCO, Trello, and Clockify — but shaped for consulting teams that need delivery clarity without enterprise clutter.

## Current product slice

- **Dashboard**: active projects, open tickets, billable hours, revenue, urgent work, recent time.
- **Projects**: project cockpit with customer, lead, status, budget, board, time, and quick actions.
- **Tickets**: create assignable tickets with status, priority, estimate, due date, and description.
- **Ticket board**: Backlog → Todo → In progress → Review → Done.
- **Time management**: log manual billable/internal time against projects and optional tickets.
- **Reports**: project hours, billable hours, earned revenue, and CSV export.
- **Customers**: account list connected to delivery.
- **Team**: colleagues, capacity, rates, open tickets, and logged time.
- **Persistent prototype data**: saved to `localStorage` for the current browser.

## Getting started

```bash
npm install
npm run dev
```

## Local database foundation

Loop 1 includes a Postgres Docker Compose service and environment template for the planned Next.js + Prisma + Auth.js migration. The current Vite prototype does not require the database yet.

```bash
cp .env.example .env.local
docker compose up -d postgres
```

See [local database setup](docs/local-database.md).

## Quality gates

```bash
npm run lint
npm run test
npm run build
```

## Production build

```bash
npm run build
npm run preview
```

## Product docs

- [Product spec](docs/product-spec.md)
- [Architecture](docs/architecture.md)
- [Tech stack decision](docs/tech-stack-decision.md)
- [Implementation roadmap](docs/implementation-roadmap.md)
- [Development workflow](docs/development-workflow.md)
- [Agentic system](docs/agents/agentic-system.md)

## Product direction

Next useful modules:

1. Next.js App Router shell
2. PostgreSQL schema, migrations, and seed data
3. Auth.js login and workspace model
4. Database-backed customers, projects, tickets, time, and team
5. Edit/delete/detail drawers for core entities
6. Live timer, weekly timesheet, and report filters
7. Budget burn, utilization, and profitability reports
8. GitHub Actions CI, Playwright E2E, and self-hosting docs

## License

MIT
