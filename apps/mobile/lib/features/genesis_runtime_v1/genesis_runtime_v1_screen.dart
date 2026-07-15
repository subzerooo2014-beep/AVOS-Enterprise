import "package:flutter/material.dart";

class GenesisScreen extends StatelessWidget {
  const GenesisScreen({super.key});

  static const capabilities = <String>[
  "DATABASE_GENERATOR",
  "AI_AGENT_GENERATOR",
  "WORKFLOW_GENERATOR",
  "PLUGIN_GENERATOR",
  "SDK_GENERATOR",
  "DOCUMENTATION_GENERATOR",
  "TEST_GENERATOR",
  "RUNTIME_COMMAND_CENTER"
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Genesis Runtime V1")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: capabilities
            .map((item) => Card(child: ListTile(title: Text(item))))
            .toList(),
      ),
    );
  }
}