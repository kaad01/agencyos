---
name: agencyos-pr-readability
description: Create clearer, reviewable GitHub pull requests for AgencyOS or related repo work. Use when opening, updating, reviewing, merging, or summarizing PRs; writing PR titles/bodies; preparing branches/commits; or when Kaan asks for better PR readability, clearer changelogs, cleaner review flow, screenshots, checks, or release-quality PR descriptions.
---

# AgencyOS PR Readability

Use this skill to make PRs easy for Kaan and outside contributors to review quickly.

## Core rule

A good PR should answer, in order:

1. **What changed?**
2. **Why does it matter?**
3. **How was it verified?**
4. **What should the reviewer look at first?**
5. **What risks or follow-ups remain?**

Do not open vague PRs with only a generic summary.

## Before opening a PR

1. Sync from the correct base branch.
2. Create a focused branch with a readable name:
   - `feature/<short-scope>`
   - `fix/<short-scope>`
   - `docs/<short-scope>`
3. Keep one PR to one reviewable purpose.
4. Inspect the diff before committing:
   - `git diff --stat`
   - `git diff -- <important files>` when needed
5. Run the smallest meaningful gates:
   - code/schema: `npm run db:validate`, `npm run lint`, `npm run test`, `npm run build`
   - docs/assets only: at least inspect files and run build if README asset paths may affect rendering
6. Commit with a concrete message.

## PR title style

Use a short action title:

- `Add Loop 1 backend foundation`
- `Create GitHub showcase page`
- `Migrate projects to database-backed routes`
- `Fix ticket board status updates`

Avoid:

- `updates`
- `changes`
- `work stuff`
- giant titles with every detail

## PR body template

Prefer creating PRs with `--body-file` so Markdown stays readable.

```md
## Why

One or two short paragraphs explaining the user/product problem.

## What changed

- Clear bullet
- Clear bullet
- Clear bullet

## Reviewer guide

Start here:

1. `path/to/important-file`
2. `path/to/next-file`
3. `path/to/docs-or-tests`

## Screenshots / demo

Add screenshots, GIFs, or links for UI/README changes.

## Verification

- [x] `npm run db:validate`
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`

## Risk / rollback

- Risk: short note, or `Low — docs/assets only`.
- Rollback: revert this PR.

## Follow-ups

- Optional next step
- Optional known gap
```

If a section does not apply, write `None` or omit only when truly unnecessary. Do not leave placeholder text.

## For UI or GitHub presentation PRs

Include visual proof:

- screenshots
- GIFs
- generated assets list
- live demo link when relevant

Add a `Reviewer guide` that points to the most visual/readable files first, usually:

1. `README.md`
2. `docs/assets/...`
3. `.github/...`

## For backend/schema PRs

Mention data model impact clearly:

- new models/enums
- migration/seed behavior
- env/config changes
- workspace scoping/security assumptions
- whether runtime behavior changed

Add verification for schema and app gates.

## For stacked or dependent PRs

State dependency at top:

```md
Depends on: #123
```

Explain whether the PR should be reviewed after merge of the dependency.

## PR creation command pattern

Use a temp body file instead of inline escaped newlines:

```bash
cat > /tmp/agencyos-pr.md <<'EOF'
## Why

...
EOF

gh pr create \
  --base master \
  --head <branch> \
  --title "<Readable title>" \
  --body-file /tmp/agencyos-pr.md
```

## User-facing summary after opening PR

Tell Kaan only what matters:

- PR number/link
- branch
- 3–6 bullets of what changed
- checks passed
- any blocker/risk
- recommended next step

Keep it readable. Avoid dumping raw tool logs.
