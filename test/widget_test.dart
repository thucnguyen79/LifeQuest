import 'package:flutter_test/flutter_test.dart';

import 'package:lifequest/app/app.dart';

void main() {
  testWidgets('LifeQuest shows onboarding entry point', (tester) async {
    await tester.pumpWidget(const LifeQuestApp());

    expect(find.text('LifeQuest'), findsOneWidget);
    expect(find.text('Every habit shapes your character.'), findsOneWidget);

    await tester.tap(find.text('Start Adventure'));
    await tester.pumpAndSettle();

    expect(find.text('Daily Adventure'), findsOneWidget);
  });
}
