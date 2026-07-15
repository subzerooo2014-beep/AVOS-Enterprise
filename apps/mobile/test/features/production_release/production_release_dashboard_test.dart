import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/production_release/production_release_dashboard.dart';

void main() {
  testWidgets('renders production release dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ProductionReleaseDashboard()),
    );

    expect(find.text('AVOS Production Release'), findsOneWidget);
    expect(find.text('PRODUCTION READY'), findsOneWidget);
    expect(find.text('Production Certificate'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
