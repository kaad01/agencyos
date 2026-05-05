# AgencyOS Product Spec

## Product intent

AgencyOS is an open-source consulting agency operating system. It should combine the useful core of:

- MOCO-style agency project and budget control
- Trello-style ticket boards
- Clockify-style time tracking and reports

The product should stay simple: projects are the center, tickets define work, colleagues are assigned, time is logged, and reports show whether delivery is healthy.

## Current MVP slice: Agency operations core

### Navigation

- Dashboard
- Projects
- Tickets
- Time
- Reports
- Customers
- Team

The previous Workflow tab is removed from the product UI. Development workflow remains in docs.

### Core workflows

1. **Project cockpit**
   - Open a project and see customer, lead, status, budget, logged time, billable time, earned revenue, open tickets, board, and project timesheet.
   - Add tickets and log time from the project page.

2. **Ticket workflow**
   - Create tickets linked to projects.
   - Assign a colleague.
   - Track status through Backlog, Todo, In progress, Review, Done.
   - Store priority, estimate, due date, and description.

3. **Time workflow**
   - Log manual time against project and optional ticket.
   - Track colleague, date, hours, billable flag, and note.
   - Project/report totals update from time entries.

4. **Reporting workflow**
   - Show total time, billable time, project revenue, and per-project breakdown.
   - Export time report as CSV.

5. **Team/customer workflow**
   - Customers own projects.
   - Team members have roles, capacity, rates, assigned tickets, and logged time.

## MVP acceptance criteria

- User can create projects, tickets, time entries, customers, and team members.
- Project page includes a working ticket board and project time list.
- Tickets can be moved between statuses.
- Time can be logged against a project and optionally a ticket.
- Reports derive from saved time entries, not static numbers.
- CSV export works for time entries.
- Data persists locally in the browser for the prototype.

## Open-source architecture direction

Move toward a boring modular monolith:

- Frontend/full-stack: Next.js or equivalent React full-stack framework
- Database: PostgreSQL
- ORM: Prisma or Drizzle
- Auth: Auth.js or similar
- Deployment: Docker Compose for local app + Postgres, Vercel for hosted demo
- Modules: customers, projects, tickets, time, reports, team, settings

## Defer

- Invoicing
- Expenses
- Quotes/proposals
- Live stopwatch
- Calendar integrations
- Client portal
- Advanced permissions
- Multi-currency/accounting
- AI features
- Mobile app
- Heavy onboarding/tutorials until product workflow is solid
