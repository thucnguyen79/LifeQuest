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

Status: Next

## 14. Polish UI

- RPG visual direction
- Better empty states
- Improved cards/buttons
- Lottie/Reanimated details
- Mobile responsive polish

Status: Pending

## 15. Add Tests

- XP calculation
- Level calculation
- Streak update
- Quest generation
- Repository behavior where useful

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
