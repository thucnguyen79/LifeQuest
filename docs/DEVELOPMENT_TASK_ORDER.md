# LifeQuest Development Task Order

This roadmap is the working order for building the LifeQuest MVP. Complete one task at a time, commit after each task, and keep gameplay/backend features out of scope until their step.

## 1. Create Expo Project Structure

- React Native + Expo + TypeScript
- App shell
- Expo Router
- Base theme
- Base folder structure

Status: Done

## 2. Add Dependencies

- Expo Router
- Zustand
- Expo SQLite
- Expo Notifications
- React Native Reanimated
- Lottie React Native
- React Native Web
- Later: Rive/Skia, Supabase/Firebase, RevenueCat

Status: Done

## 3. Implement Data Models

- Player
- Habit
- Quest
- Streak
- Pet

Status: Done

## 4. Implement Local Repository

- SQLite schema
- CRUD repositories
- Web preview fallback where needed

Status: Done

## 5. Implement Onboarding Flow

- Intro
- Player name
- Class selection
- Create and persist player

Status: Done

## 6. Implement Dashboard

- Player summary
- Level
- XP progress
- Stats
- Today quests preview
- Pet preview
- Navigation shortcuts

Status: Done

## 7. Implement Habit Creation

- Create habit
- Edit habit
- Disable/archive habit
- Habit list
- Persist to local DB

Status: Done

## 8. Implement Daily Quest Generator

- Generate today's quests from active habits
- Respect frequency
- Avoid duplicate quests per day

Status: Done

## 9. Implement Quest Completion

- Mark quest completed
- Add XP
- Add coins
- Increase mapped stat
- Update streak
- Update pet XP

Status: Done

## 10. Implement Level System

- Level formula
- XP bar
- Level-up state
- Reward animation placeholder

Status: Done

## 11. Implement Pet Screen

- Pet name/type
- Mood
- Level
- Growth stage
- Streak-linked progression

Status: Done

## 12. Implement Local Notifications

- Ask permission
- Schedule habit reminders
- Toggle notifications in settings

Status: Done

## 13. Implement Settings

- Notification toggle
- Sound placeholder
- Reset local data
- Privacy placeholder

Status: Done

## 14. Polish UI

- RPG visual direction
- Better empty states
- Improved cards/buttons
- Lottie/Reanimated details
- Mobile responsive polish

Status: Done

Completion note: Task 14B added reusable game UI primitives and applied them to dashboard, habits, rewards, and settings. Task 14C added `react-native-svg`, generated SVG game assets, and replaced placeholder letter runes across dashboard, habits, companion, rewards, settings, and empty states.

## 15. Add Tests

- XP calculation
- Level calculation
- Streak update
- Quest generation
- Repository behavior where useful

Status: Done

Completion note: Added Vitest with focused coverage for level and pet XP rules, daily quest generation, and quest completion reward behavior.

## 16. Persistence Hardening

- Persist active pet progress across refresh/restart
- Persist global streak summary across refresh/restart
- Hydrate player, pet, and streak state together
- Reset local pet/streak data with Settings reset
- Add web fallback repositories and focused repository tests

Status: Done

Completion note: Added web `petRepository`, native/web `streakSummaryRepository`, store hydration/upsert wiring, reset coverage, and repository tests for web pet/streak persistence.

## 17. Gameplay Rules v2

- Daily streak rules that increase once per day
- Missed quest behavior
- Daily reset logic for old pending quests
- Reward claim flow
- Level-up modal polish

Status: Done

Completion note: Added daily reset to mark old pending quests as `missed`, daily streak rules that advance once per date, daily chest claim state/repository wiring, reward claim UI, dashboard chest status, missed quest labels, level-up modal, and focused tests.

## 18. UI/Animation v2

- Lottie pet idle animation for native builds
- Web-safe Reanimated fallback for browser preview
- Level-up animation polish
- Quest complete animation
- Better RPG map/dashboard layout

Status: Done

Completion note: Added native Lottie JSON assets, web Reanimated/SVG animation fallback, animated pet idle state, animated level-up burst, quest complete sparkle, and Adventure Map dashboard section.

## 19. Quest Reconciliation

- Edit habit should update today's pending quest title/reward when safe
- Archive habit should remove or miss today's pending quest predictably
- Keep completed historical quests intact
- Add tests for edit/archive reconciliation

Status: Done

Completion note: Added `reconcileHabitQuestForDate`, repository removal by quest id, habit form/archive wiring, Dashboard refresh after edit/archive, and tests covering pending updates, completed quest preservation, non-due weekday removal, and archive removal.

## 20. Mobile Build Readiness

- Validate Expo Go/dev build startup
- App icon and splash pass
- Native notification behavior QA
- Mobile responsive pass on real device dimensions
- Document mobile setup for continuing on another machine

Status: Done

Completion note: Added LifeQuest-branded app icon/splash/adaptive/notification assets, configured iOS/Android package ids, splash and notification plugin metadata, added LAN/tunnel/doctor scripts, refreshed README, and added `docs/MOBILE_TESTING.md` for device QA.

## 21. Native Dev Build Setup

- Decide EAS local/cloud build workflow
- Add EAS project/build profile if needed
- Produce first Android development build
- Verify notification behavior in installed build
- Document build handoff steps

Status: Done

Completion note: Installed `expo-dev-client`, added EAS build profiles for Android APK, iOS simulator, iOS physical device, preview, and production, set Expo owner to `thuc.nguyen`, linked EAS project `@thuc.nguyen/lifequest`, added EAS build scripts, and documented native build handoff in `docs/NATIVE_BUILD.md`.

## 22. First EAS Build Artifact

- Finish Android development build `7af0ba3f-4cc8-4b65-b7d3-19fce4b9a2df`
- Install and test native notification/gameplay behavior

Status: Done

Completion note: First Android development build completed successfully on EAS. Build link: `https://expo.dev/accounts/thuc.nguyen/projects/lifequest/builds/7af0ba3f-4cc8-4b65-b7d3-19fce4b9a2df`.

## 23. Native Device QA

- Install the Android development APK
- Start Metro with `npm run dev-client`
- Verify onboarding and local persistence
- Verify habit reminder notification behavior from installed build
- Verify gameplay loop from onboarding through level-up and Daily Chest

Status: Pending

## 24. Game Guide / LifeQuest Codex

- Add an in-app guide that explains the core loop
- Explain current class bonuses and future class passives
- Explain stats, quests, XP, coins, streak, pet, rewards, and chest basics
- Preview upcoming systems: shop, adventure map, boss, chest rarity, and achievements
- Link guide from Dashboard and Settings

Status: Done

Completion note: Added `app/guide.tsx`, linked it from Dashboard Adventure Map and Settings, and documented both current MVP gameplay and planned v3 systems without implying unimplemented systems are already live.

## 25. Class Skills v1

- Warrior: bonus XP from Fitness and Hard quests
- Scholar: bonus coins from Learning quests
- Monk: streak shield foundation
- Creator: Deep Work combo foundation
- Explorer: chest bonus foundation
- Add tests for class reward modifiers

Status: Done

Completion note: Added centralized class skill definitions, applied Warrior/Scholar/Creator quest reward modifiers, added Explorer Daily Chest coin bonus, exposed active passives in Dashboard/Codex, routed pet XP through actual XP gained, and added focused tests for class skill math and reward application.

## 26. Quest Quality v1

- Habit target count should become true quest progress
- Quest progress should show `0/n`, `1/n`, `n/n`
- Add priority, energy, estimated time, and bonus objective metadata
- Replace instant completion with progress-based completion where applicable
- Bonus objective should affect XP/coins/boss/chest later

Status: Done

Completion note: Added habit/quest quality metadata, SQLite v2 migrations, web localStorage normalization, progress-based quest advancement, Dashboard progress and metadata display, habit form/list fields, and focused tests for progress advancement and metadata generation.

## 27. Adventure Map v1

- Let the player choose one daily zone
- Start with Forest of Focus, Scholar Library, Strength Arena, Calm Temple, and Explorer Trail
- Convert quest progress/completion into map node progress
- Clear enough nodes to unlock the next reward/boss layer
- Show daily zone state on Dashboard

Status: Done

Completion note: Added persisted daily adventure state for SQLite and web localStorage, default zone by player class, Dashboard daily zone selector, map node progress from quest progress/completion, route cleared state, reset handling, and focused tests. Follow-up polish added quest category metadata to quests, zone focus bonuses, Matched/Base/Bonus map stats, and Scout/Trial/Gate/Boss node layers.

## 28. Daily Boss v1

- Add one daily boss with HP based on today's quest load
- Convert quest progress/completion into boss damage
- Use Adventure Map route-cleared state to unlock the boss/reward layer
- Defeating the boss should improve daily reward/chest presentation

Status: Pending

## Build Rules

- Do not build all features at once.
- Complete one task at a time.
- Keep code modular.
- Use repositories instead of direct database access from UI.
- Add comments only where useful.
- Prefer simple MVP implementation.
- Avoid backend in MVP.
- Use placeholder assets first.
- After each task, summarize changed files and next recommended task.
