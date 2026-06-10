# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Polish UI

Goal: make the MVP feel more cohesive, polished, and game-like without adding new backend scope.

Scope:

- Improve RPG visual direction across dashboard, habits, companion, rewards, and settings.
- Tighten empty states and button/card hierarchy.
- Add small Reanimated/Lottie details where useful.
- Keep mobile layouts responsive and readable.
- Do not introduce backend sync, subscriptions, or inventory systems yet.
- Keep placeholders simple where real assets are not ready.

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
