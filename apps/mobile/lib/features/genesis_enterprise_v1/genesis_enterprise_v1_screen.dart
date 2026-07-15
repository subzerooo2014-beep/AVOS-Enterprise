import "package:flutter/material.dart";

class GenesisScreen extends StatelessWidget {
  const GenesisScreen({super.key});

  static const capabilities = <String>[
  "DEPLOYMENT_GENERATOR",
  "INFRASTRUCTURE_GENERATOR",
  "VALIDATION_ENGINE",
  "QUALITY_GATE",
  "RELEASE_MANAGER",
  "ROLLBACK_MANAGER",
  "VERSION_MANAGER",
  "KNOWLEDGE_REGISTRATION",
  "ENTERPRISE_BRAIN_INTEGRATION",
  "EVOLUTION_CENTER_INTEGRATION",
  "MARKETPLACE_PUBLISHER",
  "GLOBAL_COMMAND_CENTER"
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Genesis Enterprise V1")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: capabilities
            .map((item) => Card(child: ListTile(title: Text(item))))
            .toList(),
      ),
    );
  }
}