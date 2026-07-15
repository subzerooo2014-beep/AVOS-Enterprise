import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/avos_v2_final_bundle/avos_v2_final_bundle_dashboard.dart';

void main() {
  testWidgets('renders AVOS V2 final bundle dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: AvosV2FinalBundleDashboard()),
    );

    expect(find.text('AVOS V2 Final Bundle'), findsOneWidget);
    expect(find.text('Enterprise Data Platform'), findsOneWidget);
    expect(find.text('Enterprise Automation OS'), findsOneWidget);
    expect(find.text('Global Cloud Platform'), findsOneWidget);
    expect(find.text('120 capabilities'), findsOneWidget);
  });
}
