import "package:flutter/material.dart";

class EnterpriseCustomerIntelligenceG4Screen extends StatelessWidget {
  const EnterpriseCustomerIntelligenceG4Screen({super.key});

  static const capabilities = <String>[
    "Customer 360",
    "Customer Journey Genome",
    "Retention Intelligence",
    "Loyalty Optimization",
    "Personalization Engine",
    "Customer Risk Radar",
    "Lifetime Value Forecast",
    "Next Best Action",
    "Experience Orchestration",
    "Voice Of Customer",
    "Customer Recovery",
    "Customer Evidence",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Enterprise Customer Intelligence Mega Bundle G4")),
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