# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Next Task: Continue Task 14 UI Review

Goal: review the strengthened RPG UI polish pass and decide whether Task 14 is acceptable before starting tests.

Current 14B/14C pass:

- Added reusable game UI primitives: `GamePanel`, `RuneIcon`, `GameBadge`, and `EmptyState`.
- Applied the primitives to dashboard, habits, rewards, and settings for a more consistent visual language.
- Updated Rewards with a chest visual and reward slots.
- Updated Habits with quest-source cards, category runes, and badge metadata.
- Added `react-native-svg` and a generated SVG icon/asset set in `GameIcon`.
- Replaced placeholder letter runes across dashboard, habits, companion, rewards, and settings with game-style SVG icons.
- Updated empty states and companion pet visual to use generated SVG assets.
- Updated Expo SDK 56 patch packages so `expo-doctor` passes with the current tooling.

Scope:

- Review dashboard, companion, habits, rewards, and settings in web preview.
- Confirm RPG visual direction feels sufficiently different from the earlier plain card UI.
- Review whether the generated SVG assets are strong enough for MVP, or whether Task 14D should introduce Lottie/Rive hero moments.
- Check empty states, card hierarchy, and buttons on desktop-width preview and mobile-width preview.
- Confirm Reanimated details are subtle and do not make layout unstable.
- If the UI is accepted, mark Task 14 done again and move to Task 15 Add Tests.
- If the UI still feels weak, continue polish before adding tests.

Acceptance checks:

- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Web preview still opens at `http://localhost:8081`.
- Commit and push to `main`.

## Later MVP Tasks

- Add focused tests for XP, level, reminder parsing, and quest generation logic.
- Persist streak and pet repository hydration.
- Add backend sync planning after local MVP confidence is higher.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
