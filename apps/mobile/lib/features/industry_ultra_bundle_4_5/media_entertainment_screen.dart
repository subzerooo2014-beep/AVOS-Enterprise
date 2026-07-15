import "package:flutter/material.dart";

class MediaEntertainmentIndustryScreen extends StatelessWidget {
  const MediaEntertainmentIndustryScreen({super.key});

  static const capabilities = <String>[
    "Core Operations",
    "Asset & Resource Management",
    "Customer / Beneficiary 360",
    "Workforce & Volunteers",
    "Supply Chain",
    "Finance & Funding",
    "Compliance & Safety",
    "Risk & Resilience",
    "AI Intelligence",
    "Automation",
    "Ecosystem Marketplace",
    "Analytics & Impact",
    "Documents & Cases",
    "Notifications & Response",
    "Command Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Media & Entertainment")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "Media & Entertainment",
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 16),
          ...capabilities.map(
            (capability) => Card(
              child: ListTile(
                leading: const Icon(Icons.hub_outlined),
                title: Text(capability),
              ),
            ),
          ),
        ],
      ),
    );
  }
}