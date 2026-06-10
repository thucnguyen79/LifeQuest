# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Daily Quest Generator

Goal: generate today's quests from active habits using the existing repository layer.

Scope:

- Add a quest generator service.
- Read active habits from `habitRepository`.
- Respect daily vs selected weekdays frequency.
- Avoid duplicate quests for the same habit/date.
- Persist generated quests through `questRepository`.
- Load today's quests on Dashboard from `questRepository`.
- Keep quest completion out of scope for this task.
- Keep UI simple and mobile-first.

Acceptance checks:

- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web preview still opens at `http://localhost:8081`.
- Commit and push to `main`.

## Later MVP Tasks

- Complete quest and apply XP, coins, stats, streak, and pet XP.
- Implement level-up logic and reward dialog placeholder.
- Implement companion screen with pet mood and growth.
- Schedule Expo Notifications for habit reminders.
- Add settings reset local data.
- Add focused tests for XP, level, streak, and quest generation logic.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
