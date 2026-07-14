import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/enterprise_strategic_governance/strategic_intelligence_dashboard.dart';

void main() {
  testWidgets('renders strategic governance dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: StrategicIntelligenceDashboard()),
    );

    expect(find.text('Strategic Governance'), findsOneWidget);
    expect(find.text('Strategy Score'), findsOneWidget);
    expect(find.text('Strategy Simulation Engine'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
