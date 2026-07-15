import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/vehicle_marketplace_operations/marketplace_operations_dashboard.dart';

void main() {
  testWidgets('renders marketplace operations dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: MarketplaceOperationsDashboard()),
    );

    expect(find.text('Vehicle Marketplace Operations'), findsOneWidget);
    expect(find.text('Published Listings'), findsOneWidget);
    expect(find.text('Fraud Protection'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
