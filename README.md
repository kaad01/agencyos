# AgencyOS

AgencyOS is an open-source project management product for consulting agencies: simple, aesthetic, and focused on the essentials — customers, colleagues, projects, budgets, capacity, and account health.

The product direction is inspired by focused agency ERP tools like MOCO: fewer screens, strong hierarchy, fast overview, and calm daily operations.

## Current product slice

- **Functional navigation**: Overview, Projects, Colleagues, Customers, and Workflow workspaces.
- **Project management**: create projects with customer, lead, status, budget, progress, dates, and next action.
- **Colleague management**: create colleagues with role, focus, capacity, and billable target.
- **Customer management**: create accounts with owner, health, segment, revenue target, and notes.
- **Persistent demo data**: records are saved to `localStorage` for the current browser.
- **Agency dashboard**: metrics derive from saved product data.
- **Onboarding/tutorial**: guided first-run tour plus restartable training from the sidebar.
- **Open-source workflow**: branch/spec/test/PR/merge/deploy guidance built into the app and docs.

## Getting started

```bash
npm install
npm run dev
```

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
- [Development workflow](docs/development-workflow.md)

## Product direction

Next useful modules:

1. Edit/delete flows and richer detail pages
2. Authentication and multi-agency workspaces
3. API + database persistence
4. Time tracking and billable utilization reports
5. Retainers, budgets, invoices, and accounting exports
6. GitHub issue templates, PR template, and contribution guide

## License

MIT
