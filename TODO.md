# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Continue Task 14 UI Review

Goal: review the strengthened RPG UI polish pass and decide whether Task 14 is acceptable before starting tests.

Scope:

- Review dashboard, companion, habits, rewards, and settings in web preview.
- Confirm RPG visual direction feels sufficiently different from the earlier plain card UI.
- Check empty states, card hierarchy, and buttons on desktop-width preview and mobile-width preview.
- Confirm Reanimated details are subtle and do not make layout unstable.
- If the UI is accepted, mark Task 14 done again and move to Task 15 Add Tests.
- If the UI still feels weak, continue polish before adding tests.

Acceptance checks:

- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web preview still opens at `http://localhost:8081`.
- Commit and push to `main`.

## Later MVP Tasks

- Add focused tests for XP, level, reminder parsing, and quest generation logic.
- Persist streak and pet repository hydration.
- Add backend sync planning after local MVP confidence is higher.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
