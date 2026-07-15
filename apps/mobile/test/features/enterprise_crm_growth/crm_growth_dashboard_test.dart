import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/enterprise_crm_growth/crm_growth_dashboard.dart';

void main() {
  testWidgets('renders CRM growth dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: CrmGrowthDashboard()),
    );

    expect(find.text('CRM & Growth Intelligence'), findsOneWidget);
    expect(find.text('Active Customers'), findsOneWidget);
    expect(find.text('Growth Intelligence'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
