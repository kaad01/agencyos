# AgencyOS Product Spec

## Product intent

AgencyOS is a focused, open-source operating system for small consulting agencies. It should feel closer to a calm workspace than an enterprise ERP: fast overview, obvious next actions, and workflows that connect customers, colleagues, and projects.

## Core workflows

### 1. Onboard the agency

- User sees a guided tour on first visit.
- Tour explains dashboard, project creation, team capacity, customers, and workflow standards.
- User can restart or dismiss onboarding at any time.
- First-time users should know what to do within 2 minutes.

### 2. Manage customers

- Create and update customers with name, segment, owner, health, revenue target, notes.
- Customer health should be visible across the product.
- Customers are the parent object for projects.

### 3. Manage colleagues

- Create and update colleagues with role, weekly capacity, billable target, skills/focus, and active status.
- Show capacity pressure so staffing decisions are easy.
- Project leads should come from colleagues.

### 4. Manage projects

- Create and update projects with customer, lead, status, budget, progress, start/end dates, and next action.
- Project status values: Planning, On track, At risk, Complete.
- Dashboard should surface at-risk work, deadlines, budget, and progress.

### 5. Plan delivery

- Calculate active projects, average utilization, pipeline/budget value, and customer count from real app state.
- Provide filters/search across customers, projects, and colleagues.
- Support lightweight weekly review: “what needs attention?”

## MVP acceptance criteria

- Navigation switches between Overview, Projects, Colleagues, Customers, and Workflow.
- User can create projects, colleagues, and customers from the UI.
- Data persists in localStorage for now.
- Dashboard metrics derive from saved data, not hardcoded counters.
- Onboarding tour exists and can be restarted.
- Workflow docs explain branch → spec → implementation → test → PR → merge.

## Future architecture

- Replace localStorage with API + database.
- Add auth, workspaces, roles, audit log.
- Add time tracking, invoices, retainers, reports.
- Add GitHub-backed issue/PR templates for open-source collaboration.
