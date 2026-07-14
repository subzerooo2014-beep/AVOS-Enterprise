import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'architecture_intelligence_dashboard.dart';

void main() {
  testWidgets('renders architecture intelligence metrics', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ArchitectureIntelligenceDashboard()),
    );

    expect(find.text('Architecture Intelligence'), findsOneWidget);
    expect(find.text('Architecture Fitness'), findsOneWidget);
    expect(find.text('Governance Evolution'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
