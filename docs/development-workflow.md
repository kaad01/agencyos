# Development Workflow

AgencyOS should be built like a serious open-source product, even while small.

## Branching

- `master` is always deployable.
- Work happens on focused feature branches: `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
- One branch should map to one product slice or bug fix.

## Product change flow

1. **Spec**: Write/update requirements in `docs/product-spec.md` or a feature-specific doc.
2. **Branch**: Create a branch from latest `master`.
3. **Implement**: Keep changes small and reviewable.
4. **Test**: Run lint/build/unit tests before opening PR.
5. **PR**: Include summary, screenshots/recording for UI, test evidence, and known tradeoffs.
6. **Review**: Check UX simplicity, data correctness, accessibility, and maintainability.
7. **Merge**: Squash or merge only after checks pass.
8. **Deploy**: Vercel deploys production from `master`; preview deploys are used for PR review.

## Definition of done

- Requirement documented.
- UI works on desktop and mobile.
- Empty/loading/error states considered.
- Core path has at least one test where practical.
- `npm run lint`, `npm run test`, and `npm run build` pass.
- README or docs updated if behavior changes.

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
