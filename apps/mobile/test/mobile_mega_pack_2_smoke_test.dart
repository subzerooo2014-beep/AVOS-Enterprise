import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/src/app/avos_mobile_app.dart';

void main() {
  testWidgets('AVOS Mobile Mega Pack 2 smoke', (tester) async {
    await tester.pumpWidget(const AvosMobileApp());
    await tester.pumpAndSettle();
    expect(find.text('مرحبا الساع 👋'), findsOneWidget);
    expect(find.text('عزم AI'), findsOneWidget);
    expect(find.text('المركبات'), findsWidgets);
    expect(find.text('المفضلة'), findsWidgets);
    expect(find.text('حسابي'), findsOneWidget);
  });
}