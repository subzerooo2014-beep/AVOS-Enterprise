import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/production_certification/production_certification_dashboard.dart';

void main() {
  testWidgets('renders production certification dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ProductionCertificationDashboard()),
    );

    expect(find.text('Production Certification'), findsOneWidget);
    expect(find.text('Certification'), findsOneWidget);
    expect(find.text('Production Certificate'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
