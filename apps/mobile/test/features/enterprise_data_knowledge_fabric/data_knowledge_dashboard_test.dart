import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/enterprise_data_knowledge_fabric/data_knowledge_dashboard.dart';

void main() {
  testWidgets('renders data knowledge dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: DataKnowledgeDashboard()),
    );

    expect(find.text('Data & Knowledge Fabric'), findsOneWidget);
    expect(find.text('Governance Score'), findsOneWidget);
    expect(find.text('Data Sovereignty Intelligence'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
