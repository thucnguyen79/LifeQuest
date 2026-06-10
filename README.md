# LifeQuest

Every habit shapes your character.

LifeQuest is a mobile habit RPG built with React Native and Expo. The MVP turns real-life habits into XP, stats, streaks, rewards, and pet growth.

## Stack

- Mobile: React Native + Expo
- Language: TypeScript
- Navigation: Expo Router
- State: Zustand
- Local DB: Expo SQLite
- Animation: Reanimated + Lottie
- Notifications: Expo Notifications
- Backend later: Supabase or Firebase
- IAP later: RevenueCat
- Admin/Web later: Next.js

## Current Phase

This repository has been reset from the initial Flutter spike to an Expo TypeScript foundation.

Implemented now:

- Expo Router app shell
- LifeQuest onboarding screen
- Dashboard preview screen
- Placeholder Habits, Pet, Rewards, Settings screens
- Zustand store with starter player and quest preview data
- SQLite and notification service placeholders
- Core theme and reusable UI components

Not implemented yet:

- Habit CRUD
- Quest generation and completion
- XP, streak, level, and pet progression logic
- Local persistence wiring
- Real notification scheduling
- Backend sync

## Local Setup

Use Node 22+.

```bash
npm install
npm run typecheck
npm start
```

Useful commands:

```bash
npm run android
npm run ios
npm run web
```

## Recommended Next Task

Implement data models and local repositories for Player, Habit, Quest, Streak, and Pet using Expo SQLite.
