import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/vehicle_finance_commerce/finance_commerce_dashboard.dart';

void main() {
  testWidgets('renders finance commerce dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: FinanceCommerceDashboard()),
    );

    expect(find.text('Finance & Commerce'), findsOneWidget);
    expect(find.text('Captured Payments'), findsOneWidget);
    expect(find.text('Digital Contracts'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
