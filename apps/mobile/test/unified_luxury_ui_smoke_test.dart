import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/src/app/avos_mobile_app.dart';

void main() {
  testWidgets('AVOS Unified Luxury UI smoke', (tester) async {
    await tester.pumpWidget(const AvosMobileApp());
    await tester.pumpAndSettle();

    expect(find.text('مرحبا الساع'), findsOneWidget);
    expect(find.text('شو في خاطرك اليوم؟'), findsOneWidget);
    expect(find.text('عزم'), findsOneWidget);
    expect(find.text('اختيار عزم اليوم'), findsOneWidget);

    await tester.scrollUntilVisible(
      find.text('شراء'),
      400,
      scrollable: find.byType(Scrollable).first,
    );

    expect(find.text('شراء'), findsOneWidget);
    expect(find.text('بيع'), findsOneWidget);
    expect(find.text('مزاد'), findsOneWidget);
    expect(find.text('تفاوض'), findsOneWidget);
  });
}
