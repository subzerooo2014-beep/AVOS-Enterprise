import "package:flutter/material.dart";

class GenesisScreen extends StatelessWidget {
  const GenesisScreen({super.key});

  static const capabilities = <String>[
  "GENESIS_ORCHESTRATOR",
  "BLUEPRINT_COMPILER",
  "SYSTEM_GENERATOR",
  "DOMAIN_GENERATOR",
  "API_GENERATOR",
  "WEB_GENERATOR",
  "MOBILE_GENERATOR",
  "GENESIS_COMMAND_CENTER"
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Genesis Core V1")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: capabilities
            .map((item) => Card(child: ListTile(title: Text(item))))
            .toList(),
      ),
    );
  }
}