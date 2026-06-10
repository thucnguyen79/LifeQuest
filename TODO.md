# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Settings

Goal: complete the MVP settings screen beyond notification scheduling.

Scope:

- Keep the notification toggle and scheduling status visible.
- Add sound placeholder setting.
- Add privacy placeholder text.
- Add reset local data action for MVP testing.
- Keep reset behavior explicit and guarded.
- Do not add account/backend settings yet.

Acceptance checks:

- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web preview still opens at `http://localhost:8081`.
- Commit and push to `main`.

## Later MVP Tasks

- Add focused tests for XP, level, streak, and quest generation logic.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
