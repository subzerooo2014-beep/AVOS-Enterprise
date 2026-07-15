import "package:flutter/material.dart";

class ReferenceArchitectureScreen extends StatelessWidget {
  const ReferenceArchitectureScreen({super.key});

  static const layers = <String>[
    "Experience",
    "Application",
    "Domain",
    "Platform",
    "Data",
    "AI",
    "Integration",
    "Security",
    "Operations",
  ];

  static const registries = <String>[
    "Capability Registry",
    "Platform Registry",
    "Industry Registry",
    "Module Registry",
    "Service Registry",
    "API Registry",
    "Event Registry",
    "Workflow Registry",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Reference Architecture"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Reference Architecture",
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            "Canonical architecture layers and official registries.",
          ),
          const SizedBox(height: 20),
          const Text(
            "Architecture Layers",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 10),
          ...layers.map(
            (layer) => Card(
              child: ListTile(
                leading: const Icon(Icons.layers_outlined),
                title: Text(layer),
              ),
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            "Official Registries",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 10),
          ...registries.map(
            (registry) => Card(
              child: ListTile(
                leading: const Icon(Icons.account_tree_outlined),
                title: Text(registry),
              ),
            ),
          ),
        ],
      ),
    );
  }
}