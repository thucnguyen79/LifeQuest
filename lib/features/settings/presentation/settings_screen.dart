import 'package:flutter/material.dart';

import '../../../core/widgets/lifequest_scaffold.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const LifeQuestScaffold(
      title: 'Settings',
      child: Center(
        child: Text('Settings and local notifications will be implemented later.'),
      ),
    );
  }
}
