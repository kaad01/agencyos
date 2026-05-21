# AgencyOS — North Star & Autonomous Build Scope

_Synthesized from: current capability map + Linear/Trello/Clockify steal-list + HubSpot/Twenty CRM + MCP/plugin architecture research._
_Audience: Kaan + the autonomous build loop._

---

## 0. Goal (one sentence)

**Become the open-source, AI-native operating system for consulting agencies — the place a small/mid agency runs lead → deal → SOW → project → time → invoice → retainer, with Linear-grade UX, Trello-grade automation, Clockify-grade time depth, and a real plugin + MCP platform so the whole thing is extensible by humans *and* agents.**

Positioning: **Linear × HubSpot × Clockify × Trello-Butler, MIT, self-hostable, MCP-first.**
There is no OSS product in this exact shape today. Twenty (CRM), Plane (PM), Kimai (time), Crater (invoice) each cover a slice; AgencyOS unifies them around the agency workflow.

---

## 1. What we have today (strengths to preserve)

- **Time tracking is genuinely deep** — weekly cockpit with capacity, day health, review readiness, value summary, client packet, coach, audit, scoped CSV, timer starter queue, unlogged-ticket prompts, impact preview, resume action. ~25 PRs of compounding depth (#41–#70). **Do not regress this.**
- **Clean pure-function domain** (`src/domain.ts`, 90 exports, 641 lines of Vitest). Selector-shaped. Easy to wrap behind an API and an MCP server.
- **Schema scaffolding for the real backend already there** — Prisma + Postgres + Auth.js + Workspace/Membership/Invite/ProjectMember + RBAC enum. UI doesn't use it yet, but the bones exist.
- **PR hygiene**: small, reviewable, single-purpose commits. Keep that.

## 2. Hard problems we have not solved yet

1. **No real backend.** Everything is `localStorage`; Prisma scaffold is unwired.
2. **No auth UI / no current-user concept.** Colleagues ≠ users.
3. **No API surface.** No REST, no GraphQL, no webhooks, no OAuth apps, no MCP.
4. **No extensibility primitives.** Sidebar, modals, dashboards are hardcoded.
5. **No CRM depth.** "Customers" lack contacts, pipeline, deals, activities, communications.
6. **No invoicing / billing.** "Earned revenue" is computed, never realized.
7. **No automation engine.** Workflows are implicit in code, not data.
8. **UX polish layer is partial.** No Cmd+K, no toasts, no notifications, no dark mode, no command palette, no peek pane, no inline editing, no optimistic updates, no saved views, no batch ops.

## 3. The product shape we are aiming at

```
                ┌──────────────────────────────────────────┐
                │            AgencyOS Core                 │
                │  CRM · Projects · Time · Billing · Team  │
                └─────────────────┬────────────────────────┘
                                  │
   ┌──────────────────────────────┼──────────────────────────────┐
   │                              │                              │
┌──▼──────┐         ┌─────────────▼─────────────┐       ┌────────▼────────┐
│ Public  │         │   Event Bus + Outbox      │       │  Plugin Host    │
│ API     │         │   (webhooks, internal)    │       │  (UI slots +    │
│ REST +  │         │                           │       │   sandboxed JS) │
│ GraphQL │         └─────────────┬─────────────┘       └────────┬────────┘
└──┬──────┘                       │                              │
   │                  ┌───────────┴────────────┐                 │
   │                  │ Automation Engine      │                 │
   │                  │ (Butler-style rules,   │                 │
   │                  │  cron, AI step)        │                 │
   │                  └───────────┬────────────┘                 │
   │                              │                              │
┌──▼──────────────────────────────▼──────────────────────────────▼──┐
│                         MCP Server                                 │
│  Tools: crm.* · projects.* · time.* · invoices.* · workflows.*    │
│  Resources: deals, projects, retainers, reports as agencyos://     │
│  Auth: OAuth 2.1 + PAT                                            │
└────────────────────────────────────────────────────────────────────┘
```

Same domain model, same RBAC, projected through three surfaces (API / Plugins / MCP).

---

## 4. Scope — what's in, what's deferred

### IN (the autonomous loop will build this)

#### Tier 0 — Foundation (must land before everything else)
- **Next.js App Router migration** (already in flight on PR #76). Replace Vite SPA.
- **Auth.js wired to Prisma** (email magic-link + Google + GitHub providers). Real workspaces, real memberships, real current-user.
- **Repository layer**: every `localStorage` access replaced by Prisma queries behind a `Repo` interface. Keep `src/domain.ts` pure.
- **GraphQL gateway + REST facade**, auto-derived from the domain selectors. Single permission check point.
- **Webhook outbox** + signed delivery + retry/DLQ.
- **OAuth Apps + Personal Access Tokens.**

#### Tier 1 — UX/UX-perfect bar (Linear-grade feel)
- **Cmd+K command palette** — every mutation, navigation, and search routable.
- **Inline editing everywhere** in list views (issues, time entries, invoices, contacts).
- **Optimistic updates** — local store + server reconcile. This is what makes it *feel* native.
- **Peek/split-view detail pane** on every list.
- **Saved views + composable filter chips** (URL-serialized).
- **Batch ops** — multi-select + bulk edit.
- **Persistent timer bar** (Clockify-style) — always one click from start/stop, with "continue last entry" chip.
- **Toasts + notification center.** Kill `window.confirm`/`alert`.
- **Density toggle + light/dark/system theme.**
- **Empty states + onboarding tour + sample-workspace seed.**
- **Full WCAG AA pass** — labels, focus traps, keyboard nav, aria-live, color contrast.
- **Mobile responsive PWA** end-to-end.

#### Tier 2 — CRM depth (HubSpot-pattern, Twenty-shape)
- **Contacts** (per-company people, lifecycle stage, properties).
- **Companies** (renamed "Customers" → standardized as Company; agency-friendly aliases).
- **Deals** on a pipeline with stages, win-probability, forecast category.
- **Activities timeline** — calls, emails, meetings, notes, tasks per record.
- **Lists** (static + dynamic).
- **Email tracking + meeting scheduler** (Phase 2 of CRM, behind integration).
- **Stage entry/exit guards** — e.g. "cannot move to Proposal without attached SOW."
- **One-click Deal → Project conversion** carrying scope, stakeholders, budget.
- **Custom fields** on every standard object (metadata-driven, Twenty-style).

#### Tier 3 — Agency-specific (the moat)
- **Proposals / SOW builder** — structured blocks (problem, scope, deliverables, timeline, fees, terms), templates, variable substitution from deal/company, versioning, e-sign integration (native magic-link + DocuSign adapter).
- **Retainers** — recurring engagement with monthly hour bank, burn-rate dashboard, 50/75/100% alerts, rollover policy (use-it-or-lose / carryover with cap / bank), monthly auto-summary email.
- **Invoicing** — from approved time (T+M), milestones (fixed-fee), or retainer fee. PDF + Stripe payment link. Draft → sent → paid lifecycle. Late reminders via workflow.
- **Expenses** — receipts, billable flag, into invoice flow.
- **Client portal** — magic-link login, scoped to company: project status, deliverables, invoices, retainer balance, proposal signing, ticket creation, file space.
- **Billable rate hierarchy** — workspace → project → task → user-on-project → user. Most-specific wins.
- **Timesheet approvals** — submit → review → approve/reject → lock.
- **Resource planning / capacity** — %-allocation per consultant per week, forecast vs booked.
- **Margin tracking** per project (revenue – cost-of-delivery) and per-client LTV.

#### Tier 4 — PM depth (Linear-pattern)
- **Cycles** — auto-rolling fixed-length sprints with carry-over.
- **Initiatives → Projects → Issues** hierarchy.
- **Sub-issues** with progress roll-up.
- **Triage inbox** — single funnel for inbound (form, email-in, Slack-in, MCP).
- **SLA timers** with breach states.
- **Workflow states** mapped to canonical types (backlog/unstarted/started/completed/canceled).
- **Roadmap / Timeline view** with drag-to-reschedule.
- **Calendar view** (due dates + time blocks).
- **Slash commands** (`/assign`, `/due`, `/label`) in editors.
- **Ticket comments + activity log + attachments + tags + watchers.**

#### Tier 5 — Automation (Butler clone)
- **Triggers**: domain event + cron + manual button on entity.
- **Conditions**: predicate DSL over entity fields (`issue.priority == "P0" AND issue.label CONTAINS "client:acme"`).
- **Actions**: mutate entity, create entity, send notification (Slack/email), call webhook, run MCP tool, **AI step** (`agent.run(prompt)`).
- **Natural-language rule editor** — sentence builder with dropdown tokens (Butler-style).

#### Tier 6 — Extensibility platform (the differentiator)
- **MCP server** — Streamable HTTP transport (primary) + stdio shim (`npx @agencyos/mcp`) for Claude Desktop / Cursor. OAuth 2.1 resource server. Tool taxonomy:
  - Universal: `agencyos_search`, `agencyos_describe`, `agencyos_get`
  - CRM: `contacts_*`, `companies_*`, `deals_*`, `activities_*`
  - Agency: `proposal_draft_from_deal`, `project_create`, `time_log`, `retainer_balance`, `invoice_draft`
  - Resources: `agencyos://deal/{id}`, `agencyos://project/{id}`, `agencyos://retainer/{id}` (with subscriptions)
  - Prompts: `/triage-inbox`, `/draft-weekly-status`, `/qualify-lead`, `/monthly-retainer-summary`
- **Plugin system** — manifest-first (`plugin.yaml`, `apiVersion: agencyos/v1`), two flavors:
  - **App** (external HTTP, declarative UI Kit blocks)
  - **Extension** (in-host, Deno/V8 isolate, scoped SDK)
- **UI slot catalog**: `contact.sidebar`, `deal.sidebar`, `project.sidebar`, `inbox.card`, `command.menu`, `settings.tab`, `dashboard.widget`, `portal.client.section`, etc.
- **Plugin-contributed primitives**: MCP tools, workflow nodes, custom objects, UI views, webhook handlers, cron jobs.
- **First-party plugins as dogfood**: Stripe, Slack, Gmail/Calendar, DocuSign, GitHub, Linear (import), Clockify (import), HubSpot (import).
- **Browser extension** that injects "Start AgencyOS timer" into Linear/Jira/GitHub/Trello — distribution + viral.

### DEFERRED (explicitly out for now)
- Native mobile apps beyond PWA.
- White-label / on-prem packaging beyond docker-compose.
- Marketplace paid-app billing / Stripe Connect rev-share.
- GPS + screenshot field-team add-ons.
- Multi-currency advanced (single + Stripe-supported set is enough at v1).
- Custom-objects schema-editor UI for end users (build the API in Tier 2, UI in v0.5).

---

## 5. Sequencing (loops the autonomous swarm runs)

The autonomous loop ships **one PR per sub-task**, each ≤300 LOC where possible, gated by tests + a UI/UX polish reviewer agent before merge.

| Loop | Branch | Theme | Exit criteria |
|---|---|---|---|
| **L1** | `feat/nextjs-auth-shell` (PR #76, in flight) | Next.js + Auth.js + Postgres + first-screen migration | Sign in, see your workspace, prototype data ported. |
| **L2** | `feat/repo-layer` | Pure-domain repository abstraction + Prisma adapter; localStorage adapter kept for demo | Domain tests still green; both adapters pass the same contract. |
| **L3** | `feat/api-graphql` | Auto-derived GraphQL + REST facade + permission boundary | curl + GraphiQL work; webhooks fire. |
| **L4** | `feat/ux-polish-tier1` (parallel of mini-PRs) | Cmd+K, inline edit, optimistic updates, peek pane, toasts, notifications, dark mode, density, persistent timer bar | Lighthouse a11y ≥ 95; Playwright keyboard pass green. |
| **L5** | `feat/crm-contacts-deals` | Contacts, deals, pipelines, activities, lists, custom fields | Pipeline CRUD, timeline, deal→project convert. |
| **L6** | `feat/agency-proposals-retainers` | SOW builder, retainer model + alerts, e-sign hook | Full deal→SOW→project→retainer flow demoable. |
| **L7** | `feat/billing-invoices` | Invoices, expenses, Stripe link, late-reminder workflow | Generate from approved time, mark paid. |
| **L8** | `feat/client-portal` | Magic-link login + RLS-scoped views | Client sees own projects/invoices/retainer only. |
| **L9** | `feat/pm-depth` | Cycles, sub-issues, triage inbox, SLA, comments, attachments, tags | Linear-equivalent core ships. |
| **L10** | `feat/automation-engine` | Trigger/condition/action engine + NL rule editor | 3 sample agency automations work end-to-end. |
| **L11** | `feat/mcp-server` | Streamable HTTP MCP server + stdio shim + tool/resource/prompt catalog | Claude Desktop can drive AgencyOS through it. |
| **L12** | `feat/plugin-platform` | Manifest spec, isolate runtime, UI slot host, plugin SDK, 3 first-party plugins | One external app + one extension installed end-to-end. |
| **L13** | `feat/marketplace-mvp` | Public directory, install flow, permissions diff, version updates | Marketplace browsable on agencyos.dev. |
| **L14** | `feat/browser-extension` | Inject AgencyOS timer into other PM tools | Chrome + Firefox builds shipped. |

Loops L4–L10 run with **parallel sub-agents per role** (product-architect / ux-ui-designer / frontend-engineer / qa-test-engineer / devops-release-engineer / docs-community-engineer) per the existing `delegate-agencyos-work` skill.

---

## 6. UX/UX-perfect quality gates (every PR must pass)

Before merge, the `qa-test-engineer` + `ux-ui-designer` sub-agents enforce:

1. **Keyboard-first** — every primary action reachable via Cmd+K or single shortcut.
2. **Optimistic** — no spinners on any mutation under 200ms expected latency.
3. **Inline edit** — no modal where a cell will do.
4. **Empty states** — every list has a designed empty state with a CTA.
5. **a11y** — Lighthouse a11y ≥ 95, axe-core 0 critical, focus traps on modals, aria-live on async regions.
6. **Mobile** — every screen ≥ usable down to 375px width.
7. **Performance** — TTI < 2s on mid-tier laptop on dashboard.
8. **Visual polish** — design tokens only (no ad-hoc colors), single shadow scale, single radius scale, Inter/system stack, consistent spacing rhythm.
9. **Theming** — light + dark + system parity verified.
10. **No regressions in `src/domain.ts` Vitest suite.**

A PR that fails any gate is auto-routed back to the implementing agent with the failing report, not merged.

---

## 7. The autonomous loop wiring (concretely)

Components already in place:
- `delegate-agencyos-work` skill (six specialist roles).
- `agencyos-pr-readability` skill (small reviewable PRs).
- `memory/agencyos-post-merge-state.json` watcher tracking last merged PR.
- Vercel auto-deploys on merge to `main`.

What we turn on now:
1. **Heartbeat / cron** reads `agencyos-scope.md` + current `lastSeenMergedPr`, picks the next ready loop item, spawns the role agents in parallel.
2. Each role agent opens a feature branch, ships one focused PR ≤300 LOC with tests, runs gates, opens PR.
3. **Reviewer agent** (composed: qa + ux-ui) runs gates → either approves + merges OR comments + reassigns.
4. On merge, post-merge watcher updates state, kicks the next sub-task.
5. Failures (build/test/deploy) post to this chat for Kaan to triage; everything else proceeds silently.

Authentication / commit identity is already pinned to `Kaan Dönmez <43514057+kaad01@users.noreply.github.com>` per existing memory rule — autonomous loop inherits this.

---

## 8. Open questions for Kaan (need decisions before flipping it on)

1. **Schema strategy**: Twenty-style per-workspace Postgres schemas, or shared schema with `workspace_id` tenant column + per-workspace logical schemas only for custom objects? *Recommendation: hybrid (option 2) — simpler ops, still supports custom objects.*
2. **Workflow language**: TS-only for plugin code at v1? *Recommendation: yes, TS only in-host; offer Python SDK for external apps only.*
3. **E-sign**: native magic-link first + DocuSign adapter later, or DocuSign-only? *Recommendation: native first.*
4. **Twenty fork vs greenfield**: Twenty's AGPL + early plugin system is tempting but AGPL contaminates our MIT story if we want any closed-source consumer. *Recommendation: greenfield, MIT-clean, study Twenty as reference only.*
5. **Cadence**: How aggressive should the loop be? *Default plan: open up to 3 PRs in flight per loop, one merge per ~2 hours during work window.*
6. **Stop conditions**: Auto-pause loop when CI red 2x in a row? When Vercel deploy fails? When PR review needs human input? *Recommendation: all three.*

---

## 9. Acceptance — when is AgencyOS "done" (v1.0)?

- A solo consultant can: capture a lead from a form, qualify it, generate a SOW from a template, get it signed, convert to a project with phases, track time daily, submit weekly timesheet for client approval, generate an invoice from approved hours, get paid via Stripe link, and see retainer balance burn — **all without leaving AgencyOS, all keyboard-first**.
- A 10-person agency can: see capacity across the team, route inbound from Slack/email into triage, run cycles per client, see margin per project and LTV per client, automate the 5 most-repeated client comms via Butler rules.
- A developer can: install AgencyOS via docker-compose, write a plugin in TS with a `plugin.yaml`, `agencyos plugins install ./my-plugin`, see it mounted in the UI sidebar, contribute MCP tools and workflow nodes.
- An AI client (Claude/Cursor) can: connect to the AgencyOS MCP server with one click, list and search every object, draft a proposal, log time, advance a deal, run reports — all governed by user-granted scopes.

---

*End of scope. Source reports: `/tmp/agencyos-current.md`, `/tmp/research-pm-time.md`, `/tmp/research-crm-mcp.md`.*
