import "package:flutter/material.dart";

class IndustryFactoryScreen extends StatelessWidget {
  const IndustryFactoryScreen({super.key});

  static const capabilities = <String>[
    "Blueprint Registry",
    "Schema Designer",
    "Capability Composer",
    "Template Engine",
    "Code Generator",
    "API Generator",
    "Web Generator",
    "Mobile Generator",
    "Test Generator",
    "Documentation Generator",
    "Validation Engine",
    "Compatibility Engine",
    "Installation Engine",
    "Rollback Engine",
    "Version Manager",
    "Dependency Resolver",
    "Marketplace Registry",
    "Quality Gate",
    "Release Pipeline",
    "Factory Command Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Industry Factory")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Industry Factory & Blueprint Studio V1",
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 16),
          ...capabilities.map(
            (capability) => Card(
              child: ListTile(
                leading: const Icon(Icons.factory_outlined),
                title: Text(capability),
              ),
            ),
          ),
        ],
      ),
    );
  }
}