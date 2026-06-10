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

Implemented:

- Expo Router app shell
- Web preview support at `http://localhost:8081`
- LifeQuest onboarding intro
- Player name and class selection flow
- Player creation persisted locally
- Dashboard preview screen
- Placeholder Habits, Companion, Rewards, Settings screens
- Domain models for Player, Habit, Quest, Streak, and Pet
- SQLite schema and repository foundation
- Web-specific player repository fallback for browser preview
- Core theme and reusable UI components

Not implemented yet:

- Habit CRUD UI
- Quest generation and completion
- XP, streak, level, and pet progression logic
- Full UI wiring for local persistence beyond player creation
- Real notification scheduling
- Backend sync

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
npm run android
npm run ios
npm run typecheck
npx expo-doctor
```

Notes:

- `npm install` should use the committed `package-lock.json`.
- `react`, `react-dom`, and `react-native-web` versions are intentionally pinned to avoid web preview peer dependency drift.
- On Windows, if another Expo server is already using `8081`, stop it or run Expo on another port.
- Do not commit local `.expo/`, `node_modules/`, generated native `/android`, or `/ios` folders.

## Recommended Next Task

Build Habit CRUD and persist active habits through the local repository. Details are tracked in [TODO.md](./TODO.md).
