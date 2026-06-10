# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Pet Screen

Goal: turn the companion placeholder into a useful MVP pet progression screen.

Scope:

- Show active pet name, type, mood, level, XP, and growth stage.
- Add a mobile-first pet status layout with RPG flavor.
- Reflect quest completion progress from current store state.
- Keep pet progression simple and local for MVP.
- Do not implement pet inventory, cosmetics, or backend sync yet.

Acceptance checks:

- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web preview still opens at `http://localhost:8081`.
- Commit and push to `main`.

## Later MVP Tasks

- Schedule Expo Notifications for habit reminders.
- Add settings reset local data.
- Add focused tests for XP, level, streak, and quest generation logic.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
