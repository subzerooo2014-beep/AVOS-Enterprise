import "package:flutter/material.dart";

class EnterpriseRiskResilienceG6Screen extends StatelessWidget {
  const EnterpriseRiskResilienceG6Screen({super.key});

  static const capabilities = <String>[
    "Enterprise Risk Radar",
    "Resilience Simulation",
    "Incident Prediction",
    "Business Continuity",
    "Threat Intelligence",
    "Compliance Monitoring",
    "Recovery Orchestration",
    "Dependency Risk",
    "Operational Resilience",
    "Crisis Command",
    "Policy Enforcement",
    "Risk Evidence",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Enterprise Risk and Resilience Mega Bundle G6")),
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