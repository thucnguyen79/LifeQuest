# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Habit CRUD

Goal: let the user create and view active habits using the existing SQLite repository layer.

Scope:

- Replace placeholder `app/habits.tsx` with a real habit list screen.
- Add create habit screen.
- Fields: title, category, difficulty, frequency type, selected weekdays, optional target count, optional reminder time.
- Persist habits through `habitRepository`.
- Load active habits from local storage when opening Habits.
- Keep UI simple and mobile-first.
- Do not implement quest generation yet.

Acceptance checks:

- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web preview still opens at `http://localhost:8081`.
- Commit and push to `main`.

## Later MVP Tasks

- Generate daily quests from active habits.
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
