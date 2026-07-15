import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/infrastructure_deployment/infrastructure_deployment_dashboard.dart';

void main() {
  testWidgets('renders infrastructure deployment dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: InfrastructureDeploymentDashboard()),
    );

    expect(find.text('Infrastructure & Deployment'), findsOneWidget);
    expect(find.text('Kubernetes'), findsOneWidget);
    expect(find.text('Deployment Strategies'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
