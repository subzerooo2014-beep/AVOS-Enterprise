import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/platform_os_v2/platform_os_v2_dashboard.dart';

void main() {
  testWidgets('renders AVOS Platform OS V2 dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: PlatformOsV2Dashboard()),
    );

    expect(find.text('AVOS Platform OS V2'), findsOneWidget);
    expect(find.text('Capabilities'), findsOneWidget);
    expect(find.text('Platform Automation'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
