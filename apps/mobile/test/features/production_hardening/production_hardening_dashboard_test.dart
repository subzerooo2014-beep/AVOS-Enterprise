import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/production_hardening/production_hardening_dashboard.dart';

void main() {
  testWidgets('renders production hardening dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ProductionHardeningDashboard()),
    );

    expect(find.text('Production Hardening'), findsOneWidget);
    expect(find.text('Production Readiness'), findsOneWidget);
    expect(find.text('Observability Readiness'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
