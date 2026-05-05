---
name: delegate-agencyos-work
description: Coordinate AgencyOS work with sub-agents while keeping the main conversation responsive. Use when Kaan asks for product development, implementation, design, testing, deployment, docs, specs, PR/merge workflows, agentic systems, delegation, or any multi-step AgencyOS task that can be split across specialist agents.
---

# Delegate AgencyOS Work

Use this skill to keep Clove as Kaan's main conversational partner while specialist sub-agents handle scoped work.

## Core rule

Stay in the main chat. Delegate execution, research, QA, docs, or release work to sub-agents when the task is non-trivial. Synthesize results before answering Kaan.

## Specialist roles

Use these role labels in sub-agent prompts:

- `product-architect`: requirements, specs, workflows, roadmap, data model, acceptance criteria.
- `ux-ui-designer`: onboarding, tooltips, UX structure, accessibility, visual polish, empty states.
- `frontend-engineer`: React/TypeScript implementation, state, forms, routing, styling.
- `qa-test-engineer`: test plans, unit tests, regression checks, accessibility smoke tests.
- `devops-release-engineer`: GitHub, Vercel, CI, branch/PR/merge/deploy, environments.
- `docs-community-engineer`: README, contribution docs, tutorials, issue/PR templates.

## When to delegate

Delegate when any of these are true:

- The request has multiple workstreams.
- Work may take more than a few minutes.
- Research, design, implementation, and QA can proceed independently.
- Kaan explicitly asks for agents, delegation, skills, background work, or to keep talking while work continues.

Do not delegate for tiny edits or quick answers.

## Delegation pattern

1. Create or confirm a feature branch when code changes are likely.
2. Write a short plan in the main chat.
3. Spawn isolated sub-agents by default.
4. Give each sub-agent one concrete scope and return format.
5. Continue the main conversation while they run.
6. Review outputs, apply/merge useful changes if needed, then run gates.
7. Summarize only the useful outcome for Kaan.

## Prompt template

```md
You are acting as the <ROLE> for AgencyOS.

Context:
- Repo: /root/.openclaw/workspace
- Branch: <branch-name>
- Product: open-source consulting agency project management tool
- Current goal: <goal>

Task:
<specific assignment>

Constraints:
- Keep changes small and reviewable.
- Do not perform external writes unless explicitly authorized.
- If you modify code, run relevant checks.
- Avoid broad rewrites unless the task requires them.

Return:
- Summary
- Files changed
- Tests/checks run
- Blockers
- Recommended next step
```

## References

For detailed role definitions and routing rules, read `references/agencyos-agent-roles.md` when planning a larger delegation.
