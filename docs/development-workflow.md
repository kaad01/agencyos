# Development Workflow

AgencyOS should be built like a serious open-source product, even while small.

## Branching

- `master` is always deployable.
- Work happens on focused feature branches: `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
- One branch should map to one product slice or bug fix.

## Product change flow

1. **Pick one product slice**: Select exactly one user-visible outcome from an issue or roadmap gap.
2. **Acceptance criteria**: Define the smallest behavior that would make the slice valuable.
3. **Human checkpoint — direction**: For risky, opinionated, or strategic changes, Kaan approves the problem, scope, and desired feel before implementation.
4. **Branch**: Create a focused branch from latest `master`.
5. **Implement**: Keep changes small and reviewable; avoid broad rewrites.
6. **Test**: Run lint/build/unit tests before opening PR.
7. **PR**: Include summary, screenshots/recording for UI, test evidence, and known tradeoffs.
8. **Review**: Check UX simplicity, data correctness, accessibility, and maintainability.
9. **Human checkpoint — merge**: Kaan explicitly approves major UX direction, backend/data-model changes, auth/security, billing, or architecture changes before merge.
10. **Merge**: Squash or merge only after checks pass.
11. **Deploy + smoke**: Vercel deploys production from `master`; preview deploys are used for PR review. Runtime changes need a live smoke check.
12. **Human checkpoint — product taste**: After deploy, Kaan reviews whether the live result feels like the product AgencyOS should become.

## Definition of done

- Requirement documented.
- UI works on desktop and mobile.
- Empty/loading/error states considered.
- Core path has at least one test where practical.
- `npm run lint`, `npm run test`, and `npm run build` pass.
- Product decision is captured in the PR or a follow-up issue.
- Risky decisions have explicit human approval before merge.
- README or docs updated if behavior changes.

## Human-in-the-loop policy

Agentic work is encouraged, but agents do not own product taste or risky decisions.

Agents may proceed without interrupting Kaan for:

- docs-only improvements
- tests-only improvements
- small isolated bug fixes
- small UI polish that preserves the approved product direction
- issue/template/community metadata

Agents must pause for Kaan before merging:

- auth, access-control, security, or permissions changes
- billing/payment code
- major schema migrations or destructive database changes
- production secrets or environment changes
- large architecture pivots
- major UX flow changes where taste matters
- anything a QA/review agent marks high risk

The default posture is: move fast on reversible work, slow down on irreversible or taste-defining work.

## Quality loop

Every meaningful PR should have a small quality review before merge:

- **Product**: Does this improve the consulting-agency workflow, or is it generic project-management filler?
- **UX**: Is the core path obvious, polished, mobile-safe, and not overcomplicated?
- **Engineering**: Is the implementation small, typed, tested where practical, and easy to maintain?
- **QA**: Are obvious regressions, empty states, and edge cases covered?
- **Release**: Did CI pass, and is rollback obvious?

## PR template

```md
## Summary

## Product requirement

## Screenshots / demo

## Tests
- [ ] npm run lint
- [ ] npm run test
- [ ] npm run build

## Risks / follow-ups
```

## Agentic workflow

AgencyOS uses an agentic development model:

- Clove remains the main coordinator and conversation partner.
- Specialized sub-agents are delegated scoped tasks.
- Sub-agents return summaries, changed files, checks, blockers, and next steps.
- Clove reviews and integrates the results before finalizing.

### Standard delegation split

- Product discovery → Product Architect
- UX/onboarding → UX/UI Designer
- React implementation → Frontend Engineer
- Tests/release gates → QA/Test Engineer
- Vercel/GitHub/CI → DevOps/Release Engineer
- README/tutorial/community → Documentation/Community Engineer

### Why this matters

Kaan can keep discussing priorities, ideas, and changes with Clove while implementation or research runs in the background. This keeps the product conversation fast without losing engineering discipline.
