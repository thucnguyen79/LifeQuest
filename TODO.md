# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Current Status

Task 14 UI polish, Task 15 focused tests, and Task 16 persistence hardening are implemented.

Task 14B/14C UI pass:

- Added reusable game UI primitives: `GamePanel`, `RuneIcon`, `GameBadge`, and `EmptyState`.
- Applied the primitives to dashboard, habits, rewards, and settings for a more consistent visual language.
- Updated Rewards with a chest visual and reward slots.
- Updated Habits with quest-source cards, category runes, and badge metadata.
- Added `react-native-svg` and a generated SVG icon/asset set in `GameIcon`.
- Replaced placeholder letter runes across dashboard, habits, companion, rewards, and settings with game-style SVG icons.
- Updated empty states and companion pet visual to use generated SVG assets.
- Updated Expo SDK 56 patch packages so `expo-doctor` passes with the current tooling.

Task 15 test pass:

- Added Vitest with `npm test`.
- Added level, pet XP, and pet growth stage tests.
- Added daily quest generation tests for weekday filtering, rewards, and duplicate prevention.
- Added quest completion tests for XP, coins, level-up, discipline, mapped stat rewards, and completed quest guard.

Task 16 persistence hardening:

- Added web `petRepository` fallback so pet progress survives browser refresh.
- Added global `streakSummaryRepository` for native and web persistence.
- Hydrated player, active pet, and streak summary together on app start.
- Persisted pet progress and streak summary after quest completion.
- Reset local pet/streak data from Settings on native and web.
- Added web repository tests for pet and streak summary persistence.

Latest checks:

- `npm test` passes.
- `npm run typecheck` passes.
- `npx expo-doctor` passes.

## Next Task: Choose Next MVP Phase

Recommended options:

- Test refresh/reopen behavior after completing quests to confirm pet/streak remain visible.
- Start Task 17 Gameplay Rules v2: daily streak rules, missed quests, archive/edit quest reconciliation, and reward claim flow.
- Or start UI/Animation v2: level-up modal, quest-complete feedback, and pet idle animation.

## Later MVP Tasks

- Add backend sync planning after local MVP confidence is higher.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
