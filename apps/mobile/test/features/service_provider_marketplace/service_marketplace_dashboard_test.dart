import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/service_provider_marketplace/service_marketplace_dashboard.dart';

void main() {
  testWidgets('renders service marketplace dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ServiceMarketplaceDashboard()),
    );

    expect(find.text('Services & Providers'), findsOneWidget);
    expect(find.text('Active Services'), findsOneWidget);
    expect(find.text('Complaints & Claims'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
