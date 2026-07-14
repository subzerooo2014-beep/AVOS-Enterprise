import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/enterprise_cognition/enterprise_cognitive_dashboard.dart';

void main() {
  testWidgets('renders enterprise cognition metrics', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: EnterpriseCognitiveDashboard()),
    );

    expect(find.text('Enterprise Cognition'), findsOneWidget);
    expect(find.text('Cognition Score'), findsOneWidget);
    expect(find.text('Executive Decision Support'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
