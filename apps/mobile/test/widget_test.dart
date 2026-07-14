import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/src/app/avos_mobile_app.dart';

void main() {
  testWidgets('AVOS mobile foundation renders', (tester) async {
    await tester.pumpWidget(const AvosMobileApp());

    expect(find.text('عزم - AVOS'), findsOneWidget);
    expect(find.text('مرحبا الساع 👋'), findsOneWidget);
  });
}