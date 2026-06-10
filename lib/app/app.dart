import 'package:flutter/material.dart';

import 'router.dart';
import 'theme.dart';

class LifeQuestApp extends StatelessWidget {
  const LifeQuestApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'LifeQuest',
      debugShowCheckedModeBanner: false,
      routerConfig: appRouter,
      theme: buildLifeQuestTheme(),
    );
  }
}
