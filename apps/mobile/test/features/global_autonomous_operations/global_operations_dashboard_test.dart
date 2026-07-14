import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/global_autonomous_operations/global_operations_dashboard.dart';

void main() {
  testWidgets('renders global operations dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: GlobalOperationsDashboard()),
    );

    expect(find.text('Global Operations Center'), findsOneWidget);
    expect(find.text('Global Readiness'), findsOneWidget);
    expect(find.text('Global Enterprise Operations Center'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
