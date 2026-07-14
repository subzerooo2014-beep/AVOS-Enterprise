import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/autonomous_enterprise_operations/autonomous_operations_dashboard.dart';

void main() {
  testWidgets('renders autonomous operations dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: AutonomousOperationsDashboard()),
    );

    expect(find.text('Autonomous Operations'), findsOneWidget);
    expect(find.text('Readiness Score'), findsOneWidget);
    expect(find.text('Enterprise Command Center'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
