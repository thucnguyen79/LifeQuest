# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Local Notifications

Goal: add MVP habit reminder scheduling with Expo Notifications.

Scope:

- Ask for notification permission from settings or reminder setup.
- Schedule local reminders for habits that have `reminderTime`.
- Keep notification copy simple and habit-focused.
- Add a settings toggle that enables/disables reminder scheduling.
- Support web preview gracefully without breaking when notifications are unavailable.
- Do not implement backend push notifications yet.

Acceptance checks:

- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web preview still opens at `http://localhost:8081`.
- Commit and push to `main`.

## Later MVP Tasks

- Add settings reset local data.
- Add focused tests for XP, level, streak, and quest generation logic.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
