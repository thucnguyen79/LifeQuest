# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Current Status

Task 14 UI polish and Task 15 focused tests are implemented and pushed-ready.

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

Latest checks:

- `npm test` passes.
- `npm run typecheck` passes.
- `npx expo-doctor` passes.

## Next Task: Choose Next MVP Phase

Recommended options:

- Review dashboard, companion, habits, rewards, and settings in web preview.
- Add repository hydration tests for local persistence if we want more confidence before feature expansion.
- Start a small Task 16 planning pass for next MVP phase: onboarding polish, stronger animation moments, persistence hardening, or backend sync planning.

## Later MVP Tasks

- Persist streak and pet repository hydration.
- Add backend sync planning after local MVP confidence is higher.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
