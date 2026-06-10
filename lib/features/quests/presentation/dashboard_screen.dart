import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../app/router.dart';
import '../../../core/widgets/lifequest_scaffold.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return LifeQuestScaffold(
      title: 'Daily Adventure',
      actions: [
        IconButton(
          tooltip: 'Settings',
          onPressed: () => context.go(AppRoute.settings.path),
          icon: const Icon(Icons.settings_outlined),
        ),
      ],
      child: ListView(
        children: [
          const _HeroSummaryCard(),
          const SizedBox(height: 16),
          Text('Today Quests', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 8),
          const _EmptyStateCard(
            icon: Icons.flag_outlined,
            title: 'No quests yet',
            body: 'Habit creation and quest generation start in later tasks.',
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              OutlinedButton.icon(
                onPressed: () => context.go(AppRoute.habits.path),
                icon: const Icon(Icons.add_task),
                label: const Text('Habits'),
              ),
              OutlinedButton.icon(
                onPressed: () => context.go(AppRoute.pet.path),
                icon: const Icon(Icons.pets),
                label: const Text('Pet'),
              ),
              OutlinedButton.icon(
                onPressed: () => context.go(AppRoute.rewards.path),
                icon: const Icon(Icons.card_giftcard),
                label: const Text('Rewards'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _HeroSummaryCard extends StatelessWidget {
  const _HeroSummaryCard();

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  child: Icon(Icons.person),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'New Adventurer',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const Text('Level 1'),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const LinearProgressIndicator(value: 0),
            const SizedBox(height: 8),
            const Text('0 / 100 XP'),
          ],
        ),
      ),
    );
  }
}

class _EmptyStateCard extends StatelessWidget {
  const _EmptyStateCard({
    required this.icon,
    required this.title,
    required this.body,
  });

  final IconData icon;
  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 32),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text(body),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
