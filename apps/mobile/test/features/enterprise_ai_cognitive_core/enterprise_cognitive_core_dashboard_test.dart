import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/enterprise_ai_cognitive_core/enterprise_cognitive_core_dashboard.dart';

void main() {
  testWidgets('renders enterprise cognitive core dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: EnterpriseCognitiveCoreDashboard()),
    );

    expect(find.text('Enterprise Cognitive Core'), findsOneWidget);
    expect(find.text('Cognition Score'), findsOneWidget);
    expect(find.text('Decision Explainability Engine'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
