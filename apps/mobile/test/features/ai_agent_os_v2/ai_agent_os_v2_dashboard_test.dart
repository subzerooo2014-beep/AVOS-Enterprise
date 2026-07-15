import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:avos_mobile/features/ai_agent_os_v2/ai_agent_os_v2_dashboard.dart';

void main() {
  testWidgets('renders AI Agent OS V2 dashboard', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: AiAgentOsV2Dashboard()),
    );
    expect(find.text('AI Agent OS V2'), findsOneWidget);
    expect(find.text('Capabilities'), findsOneWidget);
    expect(find.text('Enterprise Agent Security'), findsOneWidget);
    expect(find.text('Operational'), findsNWidgets(5));
  });
}
