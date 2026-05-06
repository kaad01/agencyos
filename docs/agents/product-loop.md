# AgencyOS Agentic Product Loop

AgencyOS should be built through a repeatable product loop, not random one-off edits.

## Goal

Create a structured agentic team that continuously turns AgencyOS into a credible open-source product for consulting agencies.

The loop should produce:

- GitHub issues with clear acceptance criteria
- focused branches
- readable PRs
- automated checks
- QA/review feedback
- product decisions informed by comparable tools
- safe merge/deploy steps

## Guardrails

- Do not merge code without passing CI.
- Do not merge risky product/backend PRs without Kaan approval.
- Prefer small reviewable PRs over giant rewrites.
- Keep AgencyOS focused on consulting-agency operations, not generic project management.
- Every major product decision should connect to one of the core workflows:
  - customers
  - projects
  - tickets/tasks
  - team/workspaces
  - time tracking
  - reports
  - eventually billing/capacity

## Roles

### Product Builder Team

Responsible for implementation.

Typical sub-roles:

- `product-architect`: scope, data model, acceptance criteria
- `frontend-engineer`: UI, routes, forms, interactions
- `backend-engineer`: schema, persistence, auth, workspace scoping
- `devops-release-engineer`: CI, deploys, environment, self-hosting
- `docs-community-engineer`: README, docs, contribution flow

Output:

- branch
- commits
- PR
- checks run
- deployment notes

### QA / Review Team

Responsible for critique before merge.

Typical sub-roles:

- `qa-test-engineer`: tests, regression checks, mobile smoke, accessibility smoke
- `product-reviewer`: compares against roadmap and competitor patterns
- `market-reviewer`: evaluates usefulness, clarity, adoption potential

Output:

- review notes
- failing cases
- product feedback
- adoption score
- recommended next issues

## Loop cadence

### Continuous build loop

1. Inspect open issues, PRs, CI, and deployment state.
2. If a PR/branch is already in progress, advance or review that instead of starting competing work.
3. Choose one small high-leverage issue.
4. Write or refine acceptance criteria.
5. Pause for Kaan approval when the slice is risky, taste-defining, architectural, or hard to reverse.
6. Create a focused branch.
7. Implement the smallest valuable slice.
8. Run relevant checks.
9. Open a readable PR using the AgencyOS PR readability skill.
10. Ask QA/review agents to critique the PR.
11. Update PR or create follow-up issues from review.
12. Merge only if CI passes and the merge policy allows it.
13. Deploy/smoke-check when runtime changed.
14. Report summary to Kaan with links, checks, risk, and the next human decision if one exists.

### Human taste gates

The loop should keep Kaan in the product-owner seat without forcing constant micromanagement.

**Gate 1 — Direction**

Pause before implementation when the question is “what should this feel like?” rather than “can we build this?” Examples: navigation model, core workflow shape, pricing/billing, onboarding philosophy, CRM depth, and what to remove.

**Gate 2 — Merge**

Pause before merge when the PR changes data model, auth/security, billing, environment, large UX flows, or architecture. Safe docs/tests/small polish can still auto-merge after CI and review.

**Gate 3 — Live product judgment**

After deploy, summarize the live behavior and ask whether it feels good enough, too generic, too complex, or worth iterating.

### Quality gates

Each meaningful PR should include evidence for:

- local checks: `npm run db:validate` when relevant, `npm run lint`, `npm run test`, `npm run build`
- UI proof for visual work: screenshot, GIF, or clear reviewer guide
- product fit: why this matters for consulting agencies
- QA result: blocker/no-blocker review or follow-up issues
- rollback/risk: what could break and how to revert

### Weekly strategy loop

1. Review MOCO, Trello, HubSpot, Clockify, and similar tools.
2. Compare AgencyOS against them by workflow depth.
3. Identify gaps that matter for consulting agencies.
4. Create or reprioritize GitHub issues.
5. Update roadmap docs if product direction changes.

## Issue format

Every product issue should include:

```md
## Why

What user/product problem does this solve?

## Scope

- Concrete item
- Concrete item

## Acceptance criteria

- [ ] User-visible behavior
- [ ] Data/state behavior
- [ ] Empty/loading/error behavior if relevant
- [ ] Test or verification expectation

## References

Competitor/product/docs links if useful.
```

## PR format

Use `skills/agencyos-pr-readability/SKILL.md`.

Minimum sections:

- Why
- What changed
- Reviewer guide
- Screenshots/demo for UI work
- Verification
- Risk/rollback
- Follow-ups

## Merge/deploy policy

Allowed automatically:

- create branches
- commit focused changes
- open PRs
- run checks
- update docs/issues
- deploy preview/production when Kaan explicitly asks or for already-approved safe changes

Auto-merge allowed after Kaan approval on May 5, 2026:

- docs-only PRs
- tests-only PRs
- small UI polish PRs
- small isolated bug fixes
- issue/template/community metadata PRs
- dependency/config updates only when CI and audit pass and no breaking migration is involved

Auto-merge requirements:

- CI passes on the PR branch
- local verification was run and listed in the PR body
- QA/review pass finds no blocker
- PR is small and focused
- no secrets, destructive actions, production data deletion, or risky infra changes
- if deployed, live smoke check passes after merge
- agent posts a concise summary with merge/deploy/test result

Still requires Kaan approval:

- major schema migrations or destructive database changes
- auth/security changes that affect access control
- production secrets or environment changes
- billing/payment code
- large architecture pivots
- risky dependencies or breaking upgrades
- anything the QA/review agent marks high risk

## Success metrics

The loop should improve these over time:

- first-time GitHub impression
- mobile usability
- demo clarity
- setup success rate
- number of good first issues
- CI reliability
- product credibility score
- actual workflow completeness for consulting teams

## Installed OpenClaw cron jobs

The runtime has two scheduled loops installed:

- `AgencyOS continuous product build loop` — every 2 hours. Selects or advances one high-leverage issue/PR, implements a small slice, opens a readable PR, performs QA, and reports back. Job id: `9530e704-510e-46eb-876c-0cbd5594ac82`.
- `AgencyOS morning progress digest` — daily at 07:00 UTC. Summarizes the last 24 hours of PRs, CI/deploys, issues, autonomous work, and pending approvals. Job id: `b69eb63c-bd3b-4885-a7bb-6ca4ca618676`.
- `AgencyOS weekly competitor and QA review` — Mondays at 10:00 UTC. Reviews product/repo state against MOCO, Trello, HubSpot, and Clockify, then creates issues or PRs for adoption gaps. Job id: `c129a260-d73f-401e-aa07-6e92d1e98fbd`.

Both jobs may now auto-merge safe PRs under the policy above. Risky product/backend/security/infra PRs still pause for Kaan approval.
