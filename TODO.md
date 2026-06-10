# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Add Tests

Goal: add focused confidence around the MVP progression rules and quest generation.

Scope:

- Add test tooling that fits the Expo TypeScript app.
- Cover XP and level calculation.
- Cover pet level/growth calculation.
- Cover reminder time parsing.
- Cover daily quest generation rules where practical.
- Keep tests focused on pure logic before UI tests.

Acceptance checks:

- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web preview still opens at `http://localhost:8081`.
- Commit and push to `main`.

## Later MVP Tasks

- Persist streak and pet repository hydration.
- Add backend sync planning after local MVP confidence is higher.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
