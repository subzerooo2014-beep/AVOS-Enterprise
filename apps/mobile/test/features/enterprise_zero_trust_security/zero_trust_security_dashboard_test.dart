import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/enterprise_zero_trust_security/zero_trust_security_dashboard.dart';

void main() {
  testWidgets('renders zero trust security dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: ZeroTrustSecurityDashboard()),
    );

    expect(find.text('Zero Trust Security'), findsOneWidget);
    expect(find.text('Zero Trust Score'), findsOneWidget);
    expect(find.text('Security Command Center'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
