# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Level System

Goal: make level progression visible and add MVP level-up feedback.

Scope:

- Refine current XP display using `currentXp / 100`.
- Detect when completing a quest increases `player.level`.
- Add level-up dialog or lightweight reward banner.
- Show coin gain and new level feedback after completion.
- Keep animation simple with Reanimated/Lottie placeholder.
- Do not implement advanced reward inventory yet.
- Keep UI simple and mobile-first.

Acceptance checks:

- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web preview still opens at `http://localhost:8081`.
- Commit and push to `main`.

## Later MVP Tasks

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
