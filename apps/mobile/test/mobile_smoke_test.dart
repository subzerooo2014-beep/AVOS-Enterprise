import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/src/app/avos_mobile_app.dart';

void main() {
  testWidgets('AVOS mobile smoke', (tester) async {
    await tester.pumpWidget(const AvosMobileApp());
    await tester.pumpAndSettle();

    expect(find.text('عزم - AVOS'), findsOneWidget);
    expect(find.text('الخدمات السريعة'), findsOneWidget);
    expect(find.text('المركبات'), findsOneWidget);
    expect(find.text('المزادات'), findsOneWidget);
    expect(find.text('التمويل'), findsOneWidget);
    expect(find.text('التأمين'), findsOneWidget);
  });
}