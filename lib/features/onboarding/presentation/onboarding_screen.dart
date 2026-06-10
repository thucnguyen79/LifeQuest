import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../app/router.dart';
import '../../../core/constants/app_constants.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Spacer(),
              Text(AppConstants.appName, style: textTheme.displaySmall),
              const SizedBox(height: 8),
              Text(AppConstants.tagline, style: textTheme.titleMedium),
              const SizedBox(height: 32),
              const _OnboardingPoint(
                icon: Icons.auto_awesome,
                title: 'Earn XP from real habits',
              ),
              const _OnboardingPoint(
                icon: Icons.shield,
                title: 'Build stats like an RPG character',
              ),
              const _OnboardingPoint(
                icon: Icons.pets,
                title: 'Grow a companion through streaks',
              ),
              const Spacer(),
              FilledButton(
                onPressed: () => context.go(AppRoute.dashboard.path),
                child: const Text('Start Adventure'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OnboardingPoint extends StatelessWidget {
  const _OnboardingPoint({
    required this.icon,
    required this.title,
  });

  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Icon(icon, size: 28),
          const SizedBox(width: 12),
          Expanded(child: Text(title)),
        ],
      ),
    );
  }
}
