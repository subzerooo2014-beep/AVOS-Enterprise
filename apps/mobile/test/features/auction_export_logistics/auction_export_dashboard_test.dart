import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/auction_export_logistics/auction_export_dashboard.dart';

void main() {
  testWidgets('renders auction export dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: AuctionExportDashboard()),
    );

    expect(find.text('Auctions & Export Logistics'), findsOneWidget);
    expect(find.text('Live Auctions'), findsOneWidget);
    expect(find.text('Customs & Tracking'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
