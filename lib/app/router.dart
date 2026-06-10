import 'package:go_router/go_router.dart';

import '../features/habits/presentation/habits_screen.dart';
import '../features/onboarding/presentation/onboarding_screen.dart';
import '../features/pet/presentation/pet_screen.dart';
import '../features/quests/presentation/dashboard_screen.dart';
import '../features/rewards/presentation/rewards_screen.dart';
import '../features/settings/presentation/settings_screen.dart';

enum AppRoute {
  onboarding('/onboarding'),
  dashboard('/'),
  habits('/habits'),
  pet('/pet'),
  rewards('/rewards'),
  settings('/settings');

  const AppRoute(this.path);

  final String path;
}

final appRouter = GoRouter(
  initialLocation: AppRoute.onboarding.path,
  routes: [
    GoRoute(
      path: AppRoute.onboarding.path,
      name: AppRoute.onboarding.name,
      builder: (context, state) => const OnboardingScreen(),
    ),
    GoRoute(
      path: AppRoute.dashboard.path,
      name: AppRoute.dashboard.name,
      builder: (context, state) => const DashboardScreen(),
    ),
    GoRoute(
      path: AppRoute.habits.path,
      name: AppRoute.habits.name,
      builder: (context, state) => const HabitsScreen(),
    ),
    GoRoute(
      path: AppRoute.pet.path,
      name: AppRoute.pet.name,
      builder: (context, state) => const PetScreen(),
    ),
    GoRoute(
      path: AppRoute.rewards.path,
      name: AppRoute.rewards.name,
      builder: (context, state) => const RewardsScreen(),
    ),
    GoRoute(
      path: AppRoute.settings.path,
      name: AppRoute.settings.name,
      builder: (context, state) => const SettingsScreen(),
    ),
  ],
);
