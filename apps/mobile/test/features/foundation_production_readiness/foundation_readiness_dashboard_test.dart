import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/foundation_production_readiness/foundation_readiness_dashboard.dart';

void main() {
  testWidgets('renders foundation readiness dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: FoundationReadinessDashboard()),
    );

    expect(find.text('Foundation Readiness'), findsOneWidget);
    expect(find.text('AVOS Foundation Complete'), findsOneWidget);
    expect(find.text('READY'), findsOneWidget);
    expect(find.text('Completion Certificate'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
