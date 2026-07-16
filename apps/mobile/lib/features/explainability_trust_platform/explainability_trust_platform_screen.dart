import "package:flutter/material.dart";

class ExplainabilityTrustPlatformScreen extends StatelessWidget {
  const ExplainabilityTrustPlatformScreen({super.key});

  static const capabilities = <String>[
    "Explainability Engine",
    "Enterprise Trust Graph",
    "Knowledge Timeline",
    "Sustainability Score",
    "Upgrade Advisor",
    "Decision Explanation",
    "Trust Score",
    "Provenance Tracking",
    "Evidence Chain",
    "Transparency Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Explainability and Trust Platform")),
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