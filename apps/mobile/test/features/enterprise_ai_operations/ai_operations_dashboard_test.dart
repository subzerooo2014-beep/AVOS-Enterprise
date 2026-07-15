import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/enterprise_ai_operations/ai_operations_dashboard.dart';

void main() {
  testWidgets('renders AI operations dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: AiOperationsDashboard()),
    );

    expect(find.text('AI Operations Center'), findsOneWidget);
    expect(find.text('Active Workflows'), findsOneWidget);
    expect(find.text('Decision Intelligence'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
