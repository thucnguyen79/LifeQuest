# LifeQuest

Every habit shapes your character.

LifeQuest is a mobile habit RPG built with React Native and Expo. The MVP turns real-life habits into XP, stats, streaks, rewards, and pet growth.

## Stack

- Mobile: React Native + Expo
- Language: TypeScript
- Navigation: Expo Router
- State: Zustand
- Local DB: Expo SQLite on native, localStorage fallback for web preview
- Animation: Reanimated + Lottie
- Notifications: Expo Notifications
- Backend later: Supabase or Firebase
- IAP later: RevenueCat
- Admin/Web later: Next.js

## Current Status

Tasks 1-27 are implemented through Adventure Map v1.

Implemented:

- Expo Router app shell
- Web preview support at `http://localhost:8081`
- LifeQuest onboarding intro
- Player name and class selection flow
- Player creation persisted locally
- Dashboard preview screen with player, XP, stats, quests, pet, and streak context
- Habit list, create, edit, and archive flow
- Daily quest generation from active habits
- Quest completion with MVP rewards applied to player progress
- Level-up detection and reward feedback banner
- Companion pet screen with mood, bond XP, level, and growth stage
- Local habit reminder scheduling with Expo Notifications
- Settings screen with notifications, sound placeholder, privacy copy, and guarded reset
- Rewards vault screen with coin balance and future reward tracks
- UI polish pass for dashboard, habits, rewards, and navigation cards
- SVG game assets and UI animation pass with Reanimated web fallback and Lottie native assets
- Daily reset logic, missed quests, daily streak rules, and Daily Chest claim flow
- Quest reconciliation after habit edit/archive
- Focused Vitest coverage for gameplay rules and repositories
- Mobile-ready app icon, splash, adaptive icon, notification icon, package ids, and QA docs
- Native development build configuration with `expo-dev-client` and EAS build profiles
- First Android EAS development build artifact
- In-app LifeQuest Codex guide explaining current gameplay and upcoming systems
- Active class passives for Warrior, Scholar, Creator, and Explorer, plus Monk streak shield foundation
- Quest progress, priority, energy, estimated time, and bonus objective metadata
- Adventure Map daily zone selection with Forest of Focus, Scholar Library, Strength Arena, Calm Temple, and Explorer Trail
- Map node progress generated from quest progress and completion
- Domain models for Player, Habit, Quest, Streak, and Pet
- SQLite schema and repository foundation
- Web-specific player repository fallback for browser preview
- Core theme and reusable UI components

Not implemented yet:

- Backend sync
- Native device QA after installing the first Android development build
- RevenueCat/IAP

## Setup On A New Machine

Prerequisites:

- Node.js 22.13.0 or newer
- Git
- Expo Go app on phone if testing mobile without native build

Clone and run:

```bash
git clone https://github.com/thucnguyen79/LifeQuest.git
cd LifeQuest
npm install
npm run typecheck
npm test
npm run doctor
npm start
```

Open the browser preview:

```text
http://localhost:8081
```

If preview is blank after dependency changes:

```bash
npx expo start --clear --host localhost --port 8081
```

Useful commands:

```bash
npm run web
npm run start:lan
npm run start:tunnel
npm run dev-client
npm run android
npm run ios
npm run build:android:dev
npm run build:ios:sim
npm run build:ios:device
npm run typecheck
npm test
npm run doctor
```

Notes:

- `npm install` should use the committed `package-lock.json`.
- `react`, `react-dom`, and `react-native-web` versions are intentionally pinned to avoid web preview peer dependency drift.
- On Windows, if another Expo server is already using `8081`, stop it or run Expo on another port.
- Do not commit local `.expo/`, `node_modules/`, generated native `/android`, or `/ios` folders.
- Mobile QA details are in [docs/MOBILE_TESTING.md](./docs/MOBILE_TESTING.md).
- Native dev build steps are in [docs/NATIVE_BUILD.md](./docs/NATIVE_BUILD.md).

## Recommended Next Task

Continue with Daily Boss v1: boss HP, quest damage, and chest/reward upgrade hooks tied to Adventure Map progress. Details are tracked in [TODO.md](./TODO.md), with the full roadmap in [docs/DEVELOPMENT_TASK_ORDER.md](./docs/DEVELOPMENT_TASK_ORDER.md).
