import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/src/app/avos_mobile_app.dart';

void main() {
  testWidgets('AVOS Mobile Mega Pack 3 production UI smoke', (tester) async {
    await tester.pumpWidget(const AvosMobileApp());
    await tester.pumpAndSettle();

    expect(find.text('مرحبا الساع'), findsOneWidget);
    expect(find.text('المركبات'), findsWidgets);

    await tester.tap(find.text('المركبات').last);
    await tester.pumpAndSettle();

    expect(find.text('Toyota Land Cruiser 2024'), findsOneWidget);

    await tester.tap(find.text('Toyota Land Cruiser 2024'));
    await tester.pumpAndSettle();

    expect(find.text('تفاصيل المركبة'), findsOneWidget);
    expect(find.text('تحليل عزم'), findsOneWidget);

    await tester.scrollUntilVisible(
      find.text('تواصل مع البائع'),
      350,
      scrollable: find.byType(Scrollable).first,
    );

    expect(find.text('تواصل مع البائع'), findsOneWidget);
    expect(find.text('التمويل والتأمين'), findsOneWidget);
  });
}
