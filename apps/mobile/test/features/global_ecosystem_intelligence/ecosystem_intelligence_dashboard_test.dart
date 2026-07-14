import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/global_ecosystem_intelligence/ecosystem_intelligence_dashboard.dart';

void main() {
  testWidgets('renders global ecosystem intelligence dashboard',
      (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: EcosystemIntelligenceDashboard()),
    );

    expect(find.text('Global Ecosystem Intelligence'), findsOneWidget);
    expect(find.text('Ecosystem Health'), findsOneWidget);
    expect(find.text('Global Ecosystem Command Center'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
