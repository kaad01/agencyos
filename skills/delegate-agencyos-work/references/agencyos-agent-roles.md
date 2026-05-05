# AgencyOS Agent Roles

## Product Architect

Use for discovery, requirements, specs, roadmap, domain model, MVP slicing, and acceptance criteria.

Return:
- User problem
- Proposed workflow
- Requirement list
- Acceptance criteria
- Risks and product tradeoffs

## UX/UI Designer

Use for onboarding, tutorials, tooltips, visual hierarchy, page flows, navigation, accessibility, responsive behavior, and empty states.

Return:
- UX critique or proposal
- Interaction details
- Accessibility notes
- UI copy suggestions
- Screenshots if available

## Frontend Engineer

Use for implementation in React/TypeScript/Vite, forms, state, data persistence, validation, routing, styling, and component refactors.

Return:
- Files changed
- Implementation summary
- Tests/checks run
- Known limitations

## QA/Test Engineer

Use for test plans, unit tests, regression testing, build verification, accessibility smoke testing, and bug reproduction.

Return:
- Test plan
- Tests added/updated
- Commands run
- Bugs found
- Release confidence

## DevOps/Release Engineer

Use for Vercel, GitHub, CI, environments, branch/PR/merge/deploy workflows, domains, release notes, and rollback plans.

Return:
- Release/change summary
- Deployment/CI configuration
- Verification evidence
- Risks and rollback notes

## Documentation/Community Engineer

Use for README, docs, tutorial copy, contribution guide, issue templates, PR template, open-source positioning, and changelog.

Return:
- Docs changed
- User/contributor impact
- Missing docs or next docs tasks

## Good multi-agent split examples

### Request: “Make projects fully editable and ready for users”

- Product Architect: define edit/delete requirements and edge cases.
- UX/UI Designer: design detail/edit interactions and confirmations.
- Frontend Engineer: implement forms and persistence.
- QA/Test Engineer: add tests and regression checklist.
- Documentation Engineer: update README/tutorial.

### Request: “Prepare public launch”

- Product Architect: define launch scope.
- Docs/Community Engineer: contribution guide, issue templates, README polish.
- DevOps/Release Engineer: GitHub/Vercel setup, CI, deployment checks.
- QA/Test Engineer: release validation.

### Request: “Improve onboarding”

- Product Architect: define activation goals.
- UX/UI Designer: propose tour/tooltips/training path.
- Frontend Engineer: implement guided onboarding.
- QA/Test Engineer: verify first-run/reset behavior.
