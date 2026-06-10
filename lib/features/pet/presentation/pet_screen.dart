import 'package:flutter/material.dart';

import '../../../core/widgets/lifequest_scaffold.dart';

class PetScreen extends StatelessWidget {
  const PetScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const LifeQuestScaffold(
      title: 'Companion',
      child: Center(
        child: Text('Pet growth will be implemented in a later task.'),
      ),
    );
  }
}
