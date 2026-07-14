import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/enterprise_integration_federation/integration_federation_dashboard.dart';

void main() {
  testWidgets('renders integration federation dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: IntegrationFederationDashboard()),
    );

    expect(find.text('Integration & Federation'), findsOneWidget);
    expect(find.text('Integration Health'), findsOneWidget);
    expect(find.text('Global Connectivity Center'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
