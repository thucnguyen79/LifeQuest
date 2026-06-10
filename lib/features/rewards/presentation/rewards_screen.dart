import 'package:flutter/material.dart';

import '../../../core/widgets/lifequest_scaffold.dart';

class RewardsScreen extends StatelessWidget {
  const RewardsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const LifeQuestScaffold(
      title: 'Rewards',
      child: Center(
        child: Text('Coins, badges, and cosmetics will be implemented later.'),
      ),
    );
  }
}
