# LifeQuest Mobile Testing

Use this checklist when testing LifeQuest on a phone or when continuing from a new machine.

## Prerequisites

- Node.js 22.13.0 or newer
- Git
- Expo Go installed on the phone for quick MVP testing
- Phone and computer on the same Wi-Fi network for LAN mode
- For installed native testing, create a development build using [NATIVE_BUILD.md](./NATIVE_BUILD.md)

## First Run

```bash
npm install
npm run typecheck
npm test
npm run doctor
npm run start:lan
```

Scan the QR code with Expo Go.

If LAN discovery fails:

```bash
npm run start:tunnel
```

## Mobile Smoke Test

1. Open the app in Expo Go.
2. Reset local data from Settings if previous test data exists.
3. Create a new player.
4. Create 3 daily hard habits.
5. Open Dashboard and complete all generated quests.
6. Confirm level-up modal appears.
7. Open Rewards and claim Daily Chest.
8. Open Companion and confirm pet XP/streak are visible.
9. Close/reopen Expo Go and confirm local progress persists.

## Notification QA

Expo web preview does not support local mobile notifications. Expo Go can be used for quick checks, but the native development build is the preferred notification test target after Task 21.

For phone testing:

1. Create a habit with a reminder time a few minutes in the future.
2. Open Settings.
3. Enable Daily reminders.
4. Grant notification permission when prompted.
5. Keep the app backgrounded and wait for the scheduled reminder.
6. Confirm the notification title/body point back to LifeQuest.

Known MVP behavior:

- Notifications are scheduled from active habits with valid `HH:mm` reminder times.
- Notification channel is configured as `habit-reminders`.
- Sound effects are still a placeholder toggle.

## Shop Item Effects QA

Quest Reroll:

1. Earn at least 18 coins and buy Quest Reroll in Rewards.
2. Return to Dashboard and choose `Reroll` on a pending quest.
3. Confirm the item count decreases by one and the quest receives a `rerolled` badge.
4. Confirm target count, energy, or estimated time becomes lighter without losing progress.
5. Confirm the same quest cannot be rerolled twice.

Streak Freeze:

1. Earn at least 25 coins and buy Streak Freeze in Rewards.
2. Confirm Dashboard shows the stored freeze count in the Streak card.
3. Skip one calendar day, then complete a quest on the following day.
4. Confirm the streak continues, one freeze is consumed, and `Streak Protected` feedback appears.
5. For Monk, repeat with up to two skipped days; other classes only protect one skipped day.

## Build Readiness Checks

Run these before creating a dev build or handing the repo to another machine:

```bash
npm run typecheck
npm test
npm run doctor
```

Expo app config should include:

- iOS bundle identifier: `com.thucnguyen79.lifequest`
- Android package: `com.thucnguyen79.lifequest`
- App icon: `assets/icon.png`
- Splash icon: `assets/splash-icon.png`
- Android adaptive icon assets
- Android notification icon: `assets/notification-icon.png`

## Current Limits

- Backend sync is not implemented yet.
- RevenueCat/IAP is not implemented yet.
- Native dev build setup is configured in `eas.json`; the first EAS artifact requires Expo login/project linking.
