import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/enterprise_resilience_continuity/resilience_continuity_dashboard.dart';

void main() {
  testWidgets('renders resilience continuity dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ResilienceContinuityDashboard()),
    );

    expect(find.text('Enterprise Resilience'), findsOneWidget);
    expect(find.text('Resilience Score'), findsOneWidget);
    expect(find.text('Disaster Recovery Intelligence'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
