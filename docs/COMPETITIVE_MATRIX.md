# AgencyOS — Competitive Feature Matrix & Gap Analysis

_Companion to `docs/NORTH_STAR.md`. Snapshots the live (May 2026) feature surface of the products we are explicitly stealing from, then back-fills any missing capability into the L1–L14 loop plan._

**Method:** each row was verified against the vendor's current product/docs page (URLs cited in §3). AgencyOS column = what `NORTH_STAR.md` Tier 0–6 explicitly commits to. "—" = product does not offer the capability natively (integrations excluded unless documented as first-party).

---

## 1. Products surveyed

| Slug | Product | Category | Source |
|---|---|---|---|
| LIN | Linear | PM / issue tracker | https://linear.app/features |
| PLN | Plane.so | OSS PM (Linear-alike) | https://plane.so/ + https://docs.plane.so |
| TWY | Twenty | OSS CRM (HubSpot-alike) | https://twenty.com + https://twenty.com/developers |
| HUB | HubSpot | CRM + Sales/Marketing | https://www.hubspot.com/products/crm |
| TRL | Trello + Butler | Kanban + automation | https://trello.com/butler-automation |
| CLK | Clockify | Time tracking (free tier) | https://clockify.me/features |
| HRV | Harvest | Time + invoicing | https://www.getharvest.com/features |
| KMI | Kimai | OSS time tracking | https://www.kimai.org + https://www.kimai.org/documentation/ |

---

## 2. Capability matrix

Legend: ✅ first-class · 🟡 partial / via add-on · ❌ not offered · 🟢 _AgencyOS planned scope_

### 2.1 Issue / task tracking

- **AgencyOS (planned, L9):** 🟢 Initiatives → Projects → Issues, sub-issues w/ progress roll-up, canonical workflow states (backlog/unstarted/started/completed/canceled), comments + activity log + attachments + tags + watchers, slash commands in editors.
- **Linear:** ✅ Issues, sub-issues, parent/child, projects, initiatives, labels, priorities, estimates, dependencies, "Diffs" for code-linked issues.
- **Plane.so:** ✅ Issues, sub-issues, modules, cycles, projects, work items, dependencies, custom states.
- **Twenty:** ❌ (CRM only; "tasks" exist but no real issue tracker).
- **HubSpot:** 🟡 Tasks tied to records, not real issue tracking.
- **Trello:** 🟡 Cards on boards, checklists, no sub-issue hierarchy.
- **Clockify / Harvest / Kimai:** ❌ (time-only; have "task" entities but only as time-entry buckets).

### 2.2 Cycles / sprints

- **AgencyOS (planned, L9):** 🟢 Auto-rolling fixed-length cycles with carry-over.
- **Linear:** ✅ Cycles (auto-rolling, carry-over, completion charts). https://linear.app/docs/cycles
- **Plane.so:** ✅ Cycles + modules.
- **Twenty / HubSpot / Trello / Clockify / Harvest / Kimai:** ❌.

### 2.3 Triage / inbox

- **AgencyOS (planned, L9):** 🟢 Triage inbox — single funnel for form, email-in, Slack-in, MCP.
- **Linear:** ✅ Triage + Intake + Customer Requests + Asks. https://linear.app/features
- **Plane.so:** ✅ Inbox / pending issues.
- **HubSpot:** ✅ Conversations inbox.
- **Others:** ❌.

### 2.4 Roadmap / timeline / Gantt

- **AgencyOS (planned, L9):** 🟢 Roadmap/Timeline w/ drag-to-reschedule + calendar view.
- **Linear:** ✅ Roadmap, timeline, initiatives view.
- **Plane.so:** ✅ Gantt + timeline + modules.
- **HubSpot:** 🟡 Forecast pipeline charts, no project Gantt.
- **Trello:** 🟡 Timeline view on Premium.
- **Harvest:** 🟡 (Forecast is a separate paid product).
- **Twenty / Clockify / Kimai:** ❌.

### 2.5 Automation rules

- **AgencyOS (planned, L10):** 🟢 Trigger (event/cron/manual) + Condition DSL + Action (mutate/create/notify/webhook/MCP-tool/AI-step) + NL rule editor.
- **Linear:** 🟡 Workflow automations (auto-close, auto-assign, SLA), no general-purpose rule builder, no AI step yet inside rules. https://linear.app/docs/automations
- **Plane.so:** 🟡 Limited automations (state auto-transition); workflow engine roadmap.
- **Twenty:** ✅ Workflows v2 — visual node editor, triggers, actions, AI steps. https://twenty.com/developers/section/integrations/workflows
- **HubSpot:** ✅ Workflows (one of HubSpot's flagship features — branching, delays, AI actions, webhooks). https://www.hubspot.com/products/marketing/marketing-automation
- **Trello + Butler:** ✅ Butler — rules, card buttons, board buttons, calendar, due-date commands; NL editor. https://trello.com/butler-automation
- **Clockify / Harvest / Kimai:** ❌ (small automations: auto-stop, reminders).

### 2.6 Time tracking

- **AgencyOS (today + planned):** 🟢 Already deep — weekly cockpit, day health, capacity, review/value summary, client packet, audit, scoped CSV, persistent timer bar (planned L4).
- **Clockify:** ✅ Timer + manual entries, projects/tasks, tags, billable, idle detection, Pomodoro, auto-tracker, GPS (paid), screenshots (paid). https://clockify.me/features
- **Harvest:** ✅ Timer, timesheet, reminders, projects, billable rates.
- **Kimai:** ✅ Timer, timesheet, multi-rate, export, kiosk mode. https://www.kimai.org/features/
- **Linear:** ❌ (no native time tracking).
- **Plane.so / Twenty / HubSpot / Trello:** ❌.

### 2.7 Billable-rate hierarchy

- **AgencyOS (planned, L3 agency-specific):** 🟢 workspace → project → task → user-on-project → user. Most-specific wins.
- **Harvest:** ✅ Person-on-project + task rates + project default. https://www.getharvest.com/features/invoicing-and-payments
- **Clockify:** ✅ Workspace / project / task / user rates.
- **Kimai:** ✅ Customer/project/activity/user rates + hourly+fixed.
- **Others:** ❌ / N/A.

### 2.8 Timesheet approvals

- **AgencyOS (planned, L3):** 🟢 Submit → review → approve/reject → lock.
- **Harvest:** ✅ Approvals on Pro/Business.
- **Clockify:** ✅ Approvals (paid tier).
- **Kimai:** ✅ Timesheet approvals (community plugin / enterprise).
- **Others:** ❌.

### 2.9 Invoicing

- **AgencyOS (planned, L7):** 🟢 From approved time / milestones / retainer fee; PDF + Stripe link; draft→sent→paid; late-reminder workflow.
- **Harvest:** ✅ Invoices from tracked time/expenses, Stripe + PayPal, recurring, late reminders. https://www.getharvest.com/features/invoicing-and-payments
- **Kimai:** ✅ Invoice plugin (PDF templates, multiple statuses, customer-scoped).
- **Clockify:** 🟡 Basic invoices on paid tier.
- **HubSpot:** ✅ Commerce Hub invoices (with payments).
- **Linear / Plane.so / Twenty / Trello:** ❌.

### 2.10 Expenses

- **AgencyOS (planned, L7):** 🟢 Receipts, billable flag, into invoice.
- **Harvest:** ✅ Expense entry, receipts, mark billable, flow into invoice.
- **Kimai:** 🟡 Plugin only.
- **Others:** ❌.

### 2.11 Retainers / hour-bank

- **AgencyOS (planned, L6):** 🟢 Recurring engagement, monthly hour bank, burn-rate, 50/75/100% alerts, rollover policy, auto-summary.
- **Harvest:** 🟡 Retainers exist as a feature on Pro+ (assign a budget to a recurring period). https://www.getharvest.com/features/budgets
- **Kimai:** ❌ (workaround via budgets).
- **Everyone else:** ❌.

### 2.12 Proposals / SOW builder + e-sign

- **AgencyOS (planned, L6):** 🟢 Structured blocks, templates, variable substitution from deal/company, versioning, native magic-link sign + DocuSign adapter.
- **HubSpot:** ✅ Quotes + e-sign in Sales Hub.
- **Others surveyed:** ❌.

### 2.13 Client portal

- **AgencyOS (planned, L8):** 🟢 Magic-link login scoped per company: project status, deliverables, invoices, retainer balance, proposal signing, ticket creation, file space.
- **Harvest:** 🟡 Clients can view+pay invoices (no project portal).
- **HubSpot:** ✅ Customer Portal (ticketing). https://www.hubspot.com/products/service/customer-portal
- **Kimai / Clockify / Linear / Plane / Twenty / Trello:** ❌.

### 2.14 CRM — contacts / companies / lifecycle

- **AgencyOS (planned, L5):** 🟢 Contacts (per-company, lifecycle stage), Companies (with agency aliases), custom fields metadata-driven, Lists static+dynamic.
- **HubSpot:** ✅ Full CRM objects, lifecycle stages, lists. https://www.hubspot.com/products/crm
- **Twenty:** ✅ Standard + custom objects, fields, views; data-model-first. https://twenty.com
- **Others:** ❌.

### 2.15 CRM pipelines / deals / forecasting

- **AgencyOS (planned, L5):** 🟢 Deals on pipeline w/ stages, win-probability, forecast category, stage entry/exit guards, one-click Deal→Project conversion.
- **HubSpot:** ✅ Multiple pipelines, deal stages, forecast, AI deal-scoring.
- **Twenty:** ✅ Opportunities on Kanban, pipeline view, probability fields.
- **Others:** ❌.

### 2.16 Activities / timeline (calls/emails/meetings/notes)

- **AgencyOS (planned, L5):** 🟢 Activities timeline per record (call/email/meeting/note/task).
- **HubSpot:** ✅ Activity timeline, email sync, call recording, meetings.
- **Twenty:** ✅ Timeline + notes + tasks + emails (Gmail/IMAP sync).
- **Others:** ❌.

### 2.17 Email tracking + meeting scheduler

- **AgencyOS (planned, L5 phase 2):** 🟢 Email tracking + meeting scheduler behind integration.
- **HubSpot:** ✅ Sequences, email opens/clicks, Meetings tool.
- **Twenty:** 🟡 Email sync; no meeting scheduler.
- **Others:** ❌.

### 2.18 Public API (REST/GraphQL)

- **AgencyOS (planned, L3):** 🟢 Auto-derived GraphQL + REST + signed webhook outbox + OAuth Apps + PATs.
- **Linear:** ✅ GraphQL API, OAuth2, webhooks. https://linear.app/developers
- **Plane.so:** ✅ REST API + webhooks (OSS).
- **Twenty:** ✅ REST + GraphQL (auto-generated from data model) + webhooks + OAuth. https://twenty.com/developers
- **HubSpot:** ✅ Massive REST + webhooks + OAuth.
- **Trello:** ✅ REST + webhooks + Power-Up SDK.
- **Clockify:** ✅ REST + webhooks (paid).
- **Harvest:** ✅ REST API + OAuth2 + webhooks. https://help.getharvest.com/api-v2/
- **Kimai:** ✅ REST API (OpenAPI). https://www.kimai.org/documentation/rest-api.html

### 2.19 MCP server (native)

- **AgencyOS (planned, L11):** 🟢 Streamable HTTP MCP server + stdio shim, OAuth 2.1, tools (crm/projects/time/invoices/workflows), resources, prompts.
- **Linear:** ✅ Native MCP server. https://linear.app/changelog/2025-05-01-mcp
- **Plane.so:** 🟡 Community MCP exists; no official.
- **HubSpot:** ✅ Native MCP server (2025).
- **Twenty:** 🟡 Community MCP; not yet official.
- **Clockify / Harvest / Kimai / Trello:** ❌.

### 2.20 Plugin / extension platform

- **AgencyOS (planned, L12):** 🟢 Manifest-first, App vs Extension (Deno/V8 isolate), UI slot catalog, plugin SDK, contributed primitives (tools/workflow nodes/custom objects/views/webhooks/cron).
- **Linear:** 🟡 No third-party plugin runtime; only OAuth integrations.
- **Plane.so:** 🟡 OSS — forkable, no plugin runtime.
- **Twenty:** 🟡 Server extensions / custom objects, no third-party app store yet.
- **HubSpot:** ✅ Public app marketplace, UI Extensions (CRM cards), serverless functions. https://developers.hubspot.com/docs/platform/ui-extensions
- **Trello:** ✅ Power-Ups — first-class third-party SDK + directory. https://developer.atlassian.com/cloud/trello/
- **Clockify / Harvest / Kimai:** 🟡 (Kimai has bundle plugins; others integrations only).

### 2.21 Marketplace

- **AgencyOS (planned, L13):** 🟢 Public directory, install flow, permissions diff, version updates.
- **HubSpot, Trello (Power-Ups), Atlassian:** ✅.
- **Linear:** 🟡 Integration directory, not a marketplace.
- **Others:** ❌.

### 2.22 Mobile

- **AgencyOS (planned, L4):** 🟢 Mobile responsive PWA end-to-end (native apps explicitly deferred).
- **Linear:** ✅ Native iOS + Android. https://linear.app/mobile
- **Plane.so:** ✅ Mobile apps (beta).
- **HubSpot:** ✅ Native iOS + Android.
- **Trello:** ✅ Native iOS + Android.
- **Clockify:** ✅ iOS + Android + desktop + browser extension.
- **Harvest:** ✅ iOS + Android + Mac + browser extension.
- **Kimai:** 🟡 Community mobile (Kimai Mobile) — no official.
- **Twenty:** ❌ (web only).

### 2.23 Accessibility (WCAG)

- **AgencyOS (planned, L4):** 🟢 Lighthouse a11y ≥ 95, axe-core 0 critical, focus traps, aria-live, contrast — _quality gate enforced on every PR_.
- **Linear:** 🟡 Strong keyboard/focus story; no published VPAT.
- **HubSpot:** ✅ VPAT/WCAG 2.1 AA published.
- **Twenty / Plane / Trello / Clockify / Harvest / Kimai:** 🟡 partial; no public VPAT.

### 2.24 Keyboard-first UX + command palette

- **AgencyOS (planned, L4):** 🟢 Cmd+K palette routing every mutation/nav/search, slash commands in editors.
- **Linear:** ✅ Cmd+K, shortcuts for every action — the bar everyone copies.
- **Plane.so:** ✅ Cmd+K command palette.
- **HubSpot:** 🟡 Global search shortcut, no full command palette.
- **Twenty:** ✅ Cmd+K command menu.
- **Trello / Clockify / Harvest / Kimai:** ❌ / minimal shortcuts.

### 2.25 Saved views / filter chips / batch ops

- **AgencyOS (planned, L4):** 🟢 Saved views (URL-serialized), composable filter chips, multi-select + bulk edit.
- **Linear:** ✅ Custom views, filters, bulk edit.
- **Plane.so:** ✅ Views + filters + bulk.
- **Twenty:** ✅ Saved views per object.
- **HubSpot:** ✅ Lists/views + bulk actions.
- **Trello:** 🟡 Filters per board.
- **Clockify / Harvest / Kimai:** 🟡 report filters; no saved-view system on entity lists.

### 2.26 Insights / analytics

- **AgencyOS (planned, partial today):** 🟢 Per-week value summary, per-project margin, per-client LTV, retainer burn-rate; broader Insights not yet scoped.
- **Linear:** ✅ Insights — instant analytics on any stream of work.
- **HubSpot:** ✅ Custom dashboards, reports.
- **Twenty:** 🟡 Charts/dashboards (in progress).
- **Plane.so:** ✅ Analytics module.
- **Harvest / Clockify / Kimai:** ✅ Time/billable reports.
- **Trello:** 🟡 Dashcards / Power-Up.

### 2.27 SLA timers

- **AgencyOS (planned, L9):** 🟢 SLA timers with breach states.
- **Linear:** ✅ SLAs.
- **HubSpot:** ✅ Service Hub SLAs.
- **Plane.so:** 🟡 Roadmap.
- **Others:** ❌.

### 2.28 AI step / agents inside the product

- **AgencyOS (planned, L10 + L11):** 🟢 `agent.run(prompt)` as a workflow action; MCP server lets external agents drive the product.
- **Linear:** ✅ AI workflows + Linear Agents.
- **HubSpot:** ✅ Breeze AI agents.
- **Twenty:** ✅ Workflow AI actions.
- **Plane.so:** 🟡 Plane AI (beta).
- **Trello (Butler):** 🟡 limited AI commands.
- **Clockify / Harvest / Kimai:** ❌.

### 2.29 Browser extension (time / capture)

- **AgencyOS (planned, L14):** 🟢 Inject AgencyOS timer into Linear/Jira/GitHub/Trello.
- **Clockify, Harvest, Toggl:** ✅ — the category reference.
- **HubSpot:** ✅ (sales extension).
- **Linear / Plane / Twenty / Kimai:** ❌.

---

## 3. Sources (verified during this pass)

- Linear features: <https://linear.app/features>, Cycles <https://linear.app/docs/cycles>, Developers <https://linear.app/developers>, MCP changelog <https://linear.app/changelog/2025-05-01-mcp>, Mobile <https://linear.app/mobile>
- Plane.so: <https://plane.so/> · Docs <https://docs.plane.so>
- Twenty: <https://twenty.com> · Developers/Workflows <https://twenty.com/developers>
- HubSpot CRM: <https://www.hubspot.com/products/crm> · Workflows <https://www.hubspot.com/products/marketing/marketing-automation> · Customer Portal <https://www.hubspot.com/products/service/customer-portal> · UI Extensions <https://developers.hubspot.com/docs/platform/ui-extensions>
- Trello Butler: <https://trello.com/butler-automation> · Developer <https://developer.atlassian.com/cloud/trello/>
- Clockify: <https://clockify.me/features>
- Harvest: <https://www.getharvest.com/features> · Invoicing <https://www.getharvest.com/features/invoicing-and-payments> · Budgets/Retainers <https://www.getharvest.com/features/budgets> · API <https://help.getharvest.com/api-v2/>
- Kimai: <https://www.kimai.org> · Features <https://www.kimai.org/features/> · REST <https://www.kimai.org/documentation/rest-api.html>

---

## 4. Gaps & Recommended Additions

Capabilities that surfaced during the matrix but are **not yet explicit** in the L1–L14 plan. Each is mapped to the loop it best fits — additions only, no re-shuffling of the existing scope.

### G1 — Insights / analytics surface (Linear-grade) → **L9**
Linear's "Insights — instant analytics for any stream of work" is a category-defining feature. Today AgencyOS only has time-domain summaries. Add a generic `views.insights` pane on every saved view (issues, deals, time, invoices) that pivots/groups/charts the active filter set. Fits L9 (`feat/pm-depth`) because the underlying view system lands there.

### G2 — Native MCP-import plugins for Linear/HubSpot/Clockify/Harvest → **L12**
North-star already mentions "first-party plugins as dogfood" but does not list importers explicitly. Add as a deliverable of L12: `import-linear`, `import-clockify`, `import-harvest`, `import-hubspot`. Without these, switching cost is the #1 adoption blocker.

### G3 — Native AI/agent surface inside the app (not only via MCP) → **L10**
Linear Agents, HubSpot Breeze, Twenty inline AI editing are now table stakes. L10 already has an "AI step" inside workflows; explicitly extend it with an **in-app agent panel** (Cmd+K → "Ask the agent") that uses the same MCP toolset internally. Same loop, +1 sub-task.

### G4 — Idle detection / Pomodoro / auto-tracker → **L4** (timer-bar polish)
Clockify's auto-tracker + idle prompts are the differentiators of its desktop timer. Add to L4's persistent timer bar work: idle-detect (no input >Nm → prompt to discard/keep), optional Pomodoro mode. Cheap, large UX win, keeps us at parity with the time-tracking incumbents.

### G5 — Kiosk / shared-device time entry → **L8** (client-portal infra reuse)
Kimai's kiosk mode lets a shared device track time for many users (agencies with on-site fieldwork). The auth primitives we build for the client portal (magic-link + scoped session) generalize to "team kiosk". Add as an L8 extension.

### G6 — Recurring invoices & dunning sequences → **L7**
North-star lists invoices + late reminders, but **recurring** invoices (Harvest's flagship) and a real dunning ladder (D+3, D+7, D+14 escalation with workflow hooks) are not explicit. Add to L7.

### G7 — Quotes / proposals e-sign audit trail + versioning + decline reason → **L6**
L6 has the SOW builder with versioning. Add explicit: **signed-PDF generation with audit trail (IP, timestamp, device)**, **decline reason capture**, and **redline diff** between versions. HubSpot Quotes is the bar; we'll meet it.

### G8 — Power-Up-style third-party UI Kit declarative blocks → **L12**
The plan distinguishes "App (HTTP)" and "Extension (in-host isolate)". Add an explicit **UI Kit DSL** (Forge/Trello-Power-Up shape) so an App can render UI without serving HTML — declarative blocks rendered by the host. Reduces the bar for third-party devs.

### G9 — Marketplace permissions diff on plugin upgrade → **L13**
Already implicit in "permissions diff" — make it explicit: when a plugin upgrades, the marketplace must show a per-scope diff and require re-consent for new scopes. Same loop, ship it as a non-skippable gate.

### G10 — Public VPAT / WCAG 2.1 AA conformance statement → **L4**
The PR-level a11y gate is in place, but no plan to publish a conformance statement. HubSpot publishes one; it matters for enterprise procurement. Add a `docs/accessibility.md` VPAT-style page as an L4 deliverable.

### G11 — Forecast / capacity planning view across people-projects → **L9**
North-star §Tier 3 mentions resource planning. Make sure L9 ships a **capacity heatmap** (people × weeks, %-allocation, booked vs available) — this is Linear's "Projects" + Harvest Forecast combined.

### G12 — Custom-object UI for end users (deferred → re-evaluate at L12)
Currently deferred. Twenty's whole differentiator is "any object, any field, any view, user-defined." If we ship the plugin runtime (L12) without a custom-object UI, plugin authors can add objects but end-users can't. Recommend un-deferring a **read-only schema explorer + simple field-add UI** as part of L12.

### G13 — Stage entry/exit guards as a reusable primitive → **L10**
Pipeline guards are listed under L5 but they are conceptually the same primitive as automation conditions. Implement guards as **automation rules with a `block` action**, so the L10 engine powers them. Reduces surface area, increases composability.

### G14 — Public webhooks event catalog + replayer UI → **L3**
North-star has signed webhook outbox + retry/DLQ. Add: **published JSON-schema catalog of every event** (developer docs) and an in-app **delivery log + replay button** per endpoint. This is the difference between "we have webhooks" and "developers actually use webhooks."

### G15 — Native deep-link + universal-search across all objects → **L4**
Linear's `agencyos_search` equivalent. Cmd+K already covers actions; add **global search across deals/projects/issues/time entries/invoices/contacts** with type-grouped results. L4 polish loop.

---

_End of matrix. ~370 lines. Last verified against vendor docs: May 2026._
