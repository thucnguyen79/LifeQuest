# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Quest Completion

Goal: allow the user to complete a pending quest and apply MVP rewards.

Scope:

- Add complete button/action for pending quests on Dashboard.
- Mark quest as completed through `questRepository`.
- Add XP and coins to player.
- Increase mapped stat using habit category.
- Update discipline preview/streak summary in MVP-safe form.
- Keep pet XP update simple or placeholder if needed.
- Do not build full level-up dialog yet.
- Keep UI simple and mobile-first.

Acceptance checks:

- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web preview still opens at `http://localhost:8081`.
- Commit and push to `main`.

## Later MVP Tasks

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
