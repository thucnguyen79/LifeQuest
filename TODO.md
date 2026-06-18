# LifeQuest TODO

Full roadmap: [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md)

## Current Status

Tasks 14-26 are implemented through Quest Quality v1.

Task 14B/14C UI pass:

- Added reusable game UI primitives: `GamePanel`, `RuneIcon`, `GameBadge`, and `EmptyState`.
- Applied the primitives to dashboard, habits, rewards, and settings for a more consistent visual language.
- Updated Rewards with a chest visual and reward slots.
- Updated Habits with quest-source cards, category runes, and badge metadata.
- Added `react-native-svg` and a generated SVG icon/asset set in `GameIcon`.
- Replaced placeholder letter runes across dashboard, habits, companion, rewards, and settings with game-style SVG icons.
- Replaced class letter placeholders with character-style SVG avatars for Warrior, Scholar, Monk, Creator, and Explorer.
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

Task 20 mobile build readiness:

- Replaced default Expo icon/splash assets with LifeQuest-branded app assets.
- Added Android adaptive icon foreground/background/monochrome assets.
- Added Android notification icon.
- Configured splash screen, iOS bundle identifier, Android package, and notification plugin metadata.
- Added mobile start scripts for LAN/tunnel and `npm run doctor`.
- Added `docs/MOBILE_TESTING.md` with Expo Go, notification QA, and build readiness checklist.
- Updated README for current setup and mobile workflow.

Task 21 native dev build setup:

- Installed `expo-dev-client` for custom development builds.
- Added `eas.json` with Android development APK, iOS simulator, iOS device, preview, and production profiles.
- Added EAS helper scripts for login check, project init, Android dev build, iOS simulator build, and iOS device build.
- Set Expo owner to `thuc.nguyen` in app config.
- Linked the app to EAS project `@thuc.nguyen/lifequest`.
- Set EAS app version source to `remote` to match current EAS CLI guidance.
- Added `docs/NATIVE_BUILD.md` with new-machine setup, EAS login/init, build commands, and native QA checklist.
- First Android cloud build completed successfully on EAS.

Task 22 first EAS build artifact:

- Created EAS project `@thuc.nguyen/lifequest`.
- Generated Android credentials/keystore on Expo servers.
- Produced the first Android development APK with build ID `7af0ba3f-4cc8-4b65-b7d3-19fce4b9a2df`.
- Build link: `https://expo.dev/accounts/thuc.nguyen/projects/lifequest/builds/7af0ba3f-4cc8-4b65-b7d3-19fce4b9a2df`.
- Native device QA is the remaining follow-up: install APK, run dev client server, and verify gameplay/notifications.

Task 24 game guide / codex:

- Added an in-app `LifeQuest Codex` guide screen.
- Documented the current MVP loop: habit sources, daily quests, rewards, and pet growth.
- Added class identity cards for Warrior, Scholar, Monk, Creator, and Explorer.
- Marked current class bonuses separately from upcoming passive skills/trade-offs.
- Added coming gameplay explanations for Reward Shop, Adventure Map, Class Skills, Daily Boss, Chest Rarity, and Achievements.
- Linked the guide from Dashboard Adventure Map and Settings.

Task 25 class skills v1:

- Added centralized class skill definitions in `classSkills`.
- Warrior now gains bonus XP from Fitness quests and Hard quests.
- Scholar now gains bonus coins from Learning quests.
- Creator now gains bonus XP from Deep Work quests.
- Explorer now gains bonus coins from Daily Chest rewards.
- Monk has a streak shield foundation definition for the upcoming inventory/streak-freeze pass.
- Quest completion now reports actual XP/coins gained after class bonuses.
- Pet bond XP now uses actual quest XP gained after class modifiers.
- Dashboard and Codex show active class passive effects.
- Added focused tests for class modifiers, quest reward application, and Explorer chest bonus.

Task 26 quest quality v1:

- Added habit quality fields: priority, energy, estimated minutes, and bonus objective.
- Added quest progress fields: target count, progress count, priority, energy, estimated minutes, and bonus objective.
- Native SQLite schema now migrates existing installs to v2 and includes v2 columns for fresh installs.
- Web repositories normalize old localStorage data with default quality/progress fields.
- Daily quest generation and habit reconciliation copy target/quality metadata from habits into quests.
- Dashboard quest cards now show progress `x/n`, quality metadata, and bonus objective text.
- Quest action now increments progress first; rewards are granted only when target progress is reached.
- Habit form and habit list expose the new quality fields.
- Added focused tests for progress-only quest advancement and quest metadata generation.
- Adventure Map v1 is implemented with daily zone selection, persisted zone state, and quest progress converted into map node progress.
- Dashboard now shows the active daily zone, node progress, route cleared state, and zone selector chips.
- Added SQLite/localStorage repositories for daily adventure state and focused tests for default zone/progress rules.
- Adventure Map v1.1 adds quest category badges, zone focus bonuses, Matched/Base/Bonus progress stats, and Scout/Trial/Gate/Boss node layers.
- Existing daily quests reconcile category metadata from their source habits so old local data does not stay stuck on placeholder categories.
- Daily Boss v1 is implemented with boss HP from today's quest load, quest progress damage, Adventure Map gate locking, and Boss Chest bonus coins.
- Reward Shop v1 is implemented with Pet Food, Streak Freeze, and Quest Reroll purchases, local inventory persistence, and Pet Food feeding Mochi for bond XP.
- Pet Interaction v1 is implemented with Companion-screen feeding controls, Pet Food inventory display, Feed Mochi action, and Happy/Hungry/Sleepy/Resting care states.

Latest checks:

- `npm test` passes.
- `npm run typecheck` passes.
- `npx expo-doctor` passes.
- Native config commands are added and EAS project linking is complete.
- Android EAS development build finished successfully.
- Web bundle returns `200 OK`.

## Next Task: Shop Item Effects v1

Recommended next steps:

- Make Quest Reroll affect one pending quest.
- Make Streak Freeze interact with missed-day streak protection.
- Keep each item effect small and testable.
- Surface usable item actions in the relevant screen, not only in Rewards.

## Later MVP Tasks

- Add backend sync planning after local MVP confidence is higher.

## Product Guardrails

- Keep it habit RPG, not a plain checklist.
- Implement one task at a time.
- Prefer simple MVP behavior before advanced animation/backend work.
- Use repositories instead of direct database access from UI.
- Use placeholder visuals first; custom assets can come later.
