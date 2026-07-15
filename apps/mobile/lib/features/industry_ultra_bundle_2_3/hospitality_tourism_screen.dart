import "package:flutter/material.dart";

class HospitalityTourismIndustryScreen extends StatelessWidget {
  const HospitalityTourismIndustryScreen({super.key});

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
      appBar: AppBar(title: const Text("Hospitality & Tourism")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "Hospitality & Tourism",
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