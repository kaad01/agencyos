# AgencyOS Agentic System

## Goal

Kaan should be able to keep talking with Clove while larger work is delegated to specialized agents. Clove remains the main product partner and coordinator; sub-agents do scoped work in parallel or detached sessions.

## Operating model

- **Main agent: Clove**
  - Owns the conversation with Kaan.
  - Clarifies product intent only when needed.
  - Breaks work into small specs and delegates execution.
  - Reviews sub-agent outputs before presenting them.
  - Never forwards raw sub-agent metadata as the final answer.

- **Sub-agents**
  - Run isolated unless they need current transcript context.
  - Receive concrete tasks, success criteria, expected outputs, and repo location.
  - Return concise results with files changed, tests run, blockers, and follow-ups.

## Default specialist roles

### 1. Product Architect

Use for ambiguous product requests, roadmap decisions, data model, onboarding flows, pricing/product packaging, and requirements.

Expected output:
- Problem framing
- Proposed user workflows
- Acceptance criteria
- Risks/tradeoffs
- Files/docs to update

### 2. UX/UI Designer

Use for page structure, interaction design, onboarding, tooltips, accessibility, visual polish, mobile behavior, and empty states.

Expected output:
- UX recommendations
- Component/page changes
- Accessibility notes
- Screenshots if possible

### 3. Frontend Engineer

Use for React/TypeScript implementation, state management, forms, routing, validation, component structure, and styling.

Expected output:
- Code changes
- Tests/build evidence
- Known limitations

### 4. QA/Test Engineer

Use for test plans, unit/integration tests, regression checks, accessibility smoke tests, and release gates.

Expected output:
- Test plan
- Tests added/updated
- Commands run and results
- Bugs found

### 5. DevOps/Release Engineer

Use for Vercel, GitHub, branch/PR/merge/deploy workflow, CI, environment variables, domains, and release notes.

Expected output:
- Deployment/CI changes
- Verification evidence
- Release checklist

### 6. Documentation/Community Engineer

Use for README, contribution guide, PR templates, issue templates, user docs, tutorials, and open-source positioning.

Expected output:
- Docs changed
- Contributor/user guidance
- Gaps to document later

## Delegation rules

Delegate when:
- The request has multiple workstreams.
- Work could take more than a few minutes.
- Research, implementation, and QA can happen independently.
- The user explicitly asks for agents, skills, parallel work, or delegation.

Do not delegate when:
- A quick answer or tiny edit is enough.
- The task is privacy-sensitive or externally destructive without confirmation.
- The sub-agent would need credentials or external writes not approved by Kaan.

## Recommended task prompt format

```md
You are acting as the <ROLE> for AgencyOS.

Context:
- Repo: /root/.openclaw/workspace
- Branch: <branch>
- Product: open-source consulting agency project management tool
- Current goal: <goal>

Task:
<specific assignment>

Constraints:
- Keep changes small and reviewable.
- Do not perform external writes unless explicitly authorized.
- Run relevant checks if you modify code.

Return:
- Summary
- Files changed
- Tests/checks run
- Blockers
- Recommended next step
```

## Main-agent response pattern

When delegating:
1. Acknowledge the request briefly.
2. State the plan in 2-5 bullets.
3. Spawn one or more sub-agents.
4. Continue talking with Kaan while sub-agents work.
5. When results arrive, synthesize into one clear update.

## Branching pattern for delegated work

- Main coordination branch: `feature/<product-slice>`
- Optional sub-agent branches if changes conflict: `agent/<role>/<short-task>`
- Before merge: run `npm run lint`, `npm run test`, `npm run build`

## Current AgencyOS specialists to use

- `product-architect`
- `ux-ui-designer`
- `frontend-engineer`
- `qa-test-engineer`
- `devops-release-engineer`
- `docs-community-engineer`

These are role labels for sub-agent prompts; they do not require separate long-lived identities to be useful.
