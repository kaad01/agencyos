# Competitive Analysis Notes

AgencyOS is inspired by focused products like MOCO, Trello, Clockify, and HubSpot, but should not clone any of them. The product goal is to combine the most useful agency-operation workflows into one open-source consulting workspace.

## Reference products

### MOCO

Useful pattern: agency/business operations in one place — projects, acquisition, CRM, personnel planning, time tracking, billing/invoicing, and reporting.

AgencyOS takeaway:

- Consulting teams need project + customer + time + money in the same operational view.
- Project views should eventually expose budget, effort, profitability-lite, and billing readiness.

### Trello

Useful pattern: simple visual boards/lists/cards that users understand immediately.

AgencyOS takeaway:

- Tickets/tasks should stay visually lightweight and easy to move.
- Avoid making the board too enterprise-heavy before basic CRUD and details work well.

### HubSpot

Useful pattern: CRM records, pipelines, customer context, and relationship history.

AgencyOS takeaway:

- Customers should not be a flat address book.
- Customer detail views should connect projects, open work, logged time, account health, and revenue signals.

### Clockify

Useful pattern: accessible time tracking, timesheets, billable vs non-billable work, reports, and exports.

AgencyOS takeaway:

- Time tracking must become a first-class workflow.
- Weekly timesheets, timer, project/customer rollups, and report filters are adoption-critical.

## Differentiation target

AgencyOS should become:

> The simple open-source operating system for small consulting agencies that want clients, projects, tickets, people, time, and reports in one self-hostable workspace.

## Product principles from competitors

- From MOCO: agency-specific business workflow, not generic tasks.
- From Trello: fast, visual task movement.
- From HubSpot: customer context matters.
- From Clockify: time data must be easy to capture and export.

## What AgencyOS should avoid

- Becoming a generic Trello clone.
- Building CRM complexity before project/time workflow is useful.
- Adding billing before time/project/customer data is reliable.
- Prioritizing onboarding polish before the core product is real.
- Overengineering permissions before workspace roles are enough.

## Review checklist for future loops

When reviewing a feature, ask:

- Does this improve the customer → project → ticket → time → report loop?
- Would a small consulting agency understand it without training?
- Is the workflow faster or clearer than stitching tools together?
- Does it create useful data for reporting or future billing?
- Is it simple enough for open-source contributors to maintain?
