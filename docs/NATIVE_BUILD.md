# LifeQuest Native Dev Build

This guide is for creating installable native development builds with EAS Build.

## What Task 21 Adds

- `expo-dev-client` for custom development builds.
- `eas.json` with Android APK, iOS simulator, iOS device, preview, and production profiles.
- EAS scripts in `package.json`.
- Expo app owner set to `thuc.nguyen`.

The repo does not store Expo login credentials or build tokens.

## Prerequisites

- Node.js 22.13.0 or newer
- Git
- Expo account access: `thuc.nguyen`
- Android device for Android APK testing
- macOS plus Xcode for iOS simulator testing
- Apple Developer account for iOS physical-device builds

## First Setup On A New Machine

```bash
git clone https://github.com/thucnguyen79/LifeQuest.git
cd LifeQuest
npm install
npm run typecheck
npm test
npm run doctor
```

Log in to Expo:

```bash
npx eas-cli login
npm run eas:whoami
```

Initialize or link the EAS project:

```bash
npm run eas:init
```

`eas:init` may add `extra.eas.projectId` to `app.json`. Commit that value after the first successful project link so other machines use the same EAS project.

## Android Development Build

Create an installable Android APK:

```bash
npm run build:android:dev
```

Install the APK from the EAS build link on an Android device.

Start the Metro server for the installed dev client:

```bash
npm run dev-client
```

Open the installed LifeQuest development app and connect to the running server.

## iOS Simulator Development Build

This requires macOS and Xcode:

```bash
npm run build:ios:sim
```

Install the simulator build from the EAS build link, then run:

```bash
npm run dev-client
```

## iOS Physical Device Development Build

This requires Apple Developer credentials and device provisioning:

```bash
npm run build:ios:device
```

## Native QA Checklist

1. Install the development build.
2. Run `npm run dev-client`.
3. Complete onboarding.
4. Create a daily habit with a reminder a few minutes ahead.
5. Complete a quest and confirm XP, coins, streak, pet bond XP, and level-up feedback.
6. Claim the Daily Chest after all quests are complete.
7. Background the app and confirm the habit reminder notification arrives.
8. Close and reopen the app and confirm local progress persists.

## Current Limits

- No backend sync yet, so progress is device-local.
- No RevenueCat/IAP yet.
- No build artifact is committed to GitHub; EAS hosts build artifacts per Expo account/project.
