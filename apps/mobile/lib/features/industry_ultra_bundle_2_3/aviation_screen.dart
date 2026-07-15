import "package:flutter/material.dart";

class AviationIndustryScreen extends StatelessWidget {
  const AviationIndustryScreen({super.key});

  static const capabilities = <String>[
    "Core Operations",
    "Asset Management",
    "Customer / Citizen 360",
    "Workforce",
    "Supply Chain",
    "Finance & Revenue",
    "Compliance",
    "Risk",
    "AI Intelligence",
    "Automation",
    "Marketplace & Ecosystem",
    "Analytics",
    "Documents",
    "Notifications",
    "Command Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Aviation")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "Aviation",
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 16),
          ...capabilities.map(
            (capability) => Card(
              child: ListTile(
                leading: const Icon(Icons.domain_outlined),
                title: Text(capability),
              ),
            ),
          ),
        ],
      ),
    );
  }
}