import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/enterprise_value_optimization/enterprise_optimization_dashboard.dart';

void main() {
  testWidgets('renders enterprise optimization dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: EnterpriseOptimizationDashboard()),
    );

    expect(find.text('Enterprise Optimization'), findsOneWidget);
    expect(find.text('Enterprise Value'), findsOneWidget);
    expect(find.text('Value Forecast Engine'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
