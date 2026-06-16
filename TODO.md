# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Current Status

Tasks 14-19 are implemented through Quest Reconciliation.

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

Task 17 gameplay loop v2:

- Daily reset marks old pending quests as `missed`.
- Streak advances once per calendar day, not once per quest.
- Daily chest unlocks after all today's quests are completed.
- Rewards screen can claim the daily chest once per day for coin bonus.
- Dashboard shows chest state, missed quest state, and a stronger level-up modal.
- Added tests for daily reset, daily streak rules, and daily chest state.

Task 18 UI/Animation v2:

- Added Lottie JSON assets for native pet idle and level-up burst.
- Added web-safe Reanimated/SVG animation fallback for browser preview.
- Companion pet now idles with a floating animation.
- Level-up modal uses an animated burst instead of a static icon.
- Completed quests show a small animated sparkle.
- Dashboard shortcuts are now presented as an RPG-style Adventure Map.

Task 19 quest reconciliation:

- Editing a habit updates today's pending quest title/reward when the habit is still due today.
- Editing a habit to a non-due weekday removes today's pending quest.
- Archiving a habit removes today's pending quest.
- Completed/missed quests are kept intact for history and rewards.
- Habit form and habit archive actions refresh Dashboard quest/chest state.
- Added focused tests for edit/archive reconciliation.

Latest checks:

- `npm test` passes.
- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web bundle returns `200 OK`.

## Next Task: Choose Next MVP Phase

Recommended options:

- Test Task 19 manually: edit pending habit title/difficulty, archive pending habit, verify Dashboard updates.
- Start Task 20 Mobile Build Readiness: Expo Go/dev build, icon/splash, and notification QA.
- Or start backend sync planning after local MVP confidence is higher.

## Later MVP Tasks

- Add backend sync planning after local MVP confidence is higher.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
