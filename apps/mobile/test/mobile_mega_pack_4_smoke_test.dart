import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/src/app/avos_mobile_app.dart';

void main() {
  testWidgets('AVOS Mobile Mega Pack 4 AI smoke', (tester) async {
    await tester.pumpWidget(const AvosMobileApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('عزم AI'));
    await tester.pumpAndSettle();

    expect(find.text('عزم يفكر معك'), findsOneWidget);
    expect(find.text('محادثة عزم'), findsOneWidget);
    expect(find.text('المحادثة الصوتية'), findsOneWidget);
    expect(find.text('تحليل صورة مركبة'), findsOneWidget);
    expect(find.text('التوصيات الذكية'), findsOneWidget);
    expect(find.text('ذكاء السوق'), findsOneWidget);
  });
}