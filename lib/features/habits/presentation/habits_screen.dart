import 'package:flutter/material.dart';

import '../../../core/widgets/lifequest_scaffold.dart';

class HabitsScreen extends StatelessWidget {
  const HabitsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const LifeQuestScaffold(
      title: 'Habits',
      child: Center(
        child: Text('Habit management will be implemented in a later task.'),
      ),
    );
  }
}
