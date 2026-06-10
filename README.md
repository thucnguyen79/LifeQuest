# LifeQuest

Every habit shapes your character.

LifeQuest is a Flutter mobile app concept for a gamified habit builder. Real-life habits award XP, stats, coins, streak progress, and pet growth.

## Current Phase

This repository contains Task 01 and Task 02 only:

- Flutter project architecture
- Base app shell
- Router setup
- Theme setup
- Feature/data/service folder structure
- Initial dependencies in `pubspec.yaml`

Gameplay, persistence, quest completion, notifications, and tests will be implemented in later tasks.

## Tech Stack

- Flutter
- Dart
- flutter_riverpod
- go_router
- hive and hive_flutter
- flutter_local_notifications
- intl

## Getting Started

Install Flutter, then run:

```bash
flutter create --platforms=android,ios .
flutter pub get
flutter run
```

`flutter create .` is needed only if the cloned repository does not yet contain generated Android/iOS runner folders.

## Project Structure

```text
lib/
  main.dart
  app/
  core/
  data/
  features/
  services/
```

## Development Order

Next recommended task: implement data models for Player, Habit, Quest, Streak, and Pet.
