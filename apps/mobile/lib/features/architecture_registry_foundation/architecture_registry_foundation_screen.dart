import "package:flutter/material.dart";

class ArchitectureRegistryFoundationScreen extends StatelessWidget {
  const ArchitectureRegistryFoundationScreen({super.key});

  static const capabilities = <String>[
    "Capability Registry",
    "Platform Registry",
    "Industry Registry",
    "Module Registry",
    "Service Registry",
    "Api Registry",
    "Event Registry",
    "Workflow Registry",
    "Version Registry",
    "Architecture Standards Registry",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Architecture Registry Foundation")),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: capabilities.length,
        itemBuilder: (context, index) => Card(
          child: ListTile(
            leading: const Icon(Icons.auto_awesome),
            title: Text(capabilities[index]),
          ),
        ),
      ),
    );
  }
}