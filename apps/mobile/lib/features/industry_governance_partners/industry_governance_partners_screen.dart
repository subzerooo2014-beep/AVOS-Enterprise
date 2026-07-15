import "package:flutter/material.dart";

class IndustryGovernancePartnersScreen extends StatelessWidget {
  const IndustryGovernancePartnersScreen({super.key});

  static const components = <String>[
    "Governance",
    "Permissions",
    "Approvals",
    "Compliance",
    "Risk Assessments",
    "Partner Onboarding",
    "Partner Verification",
    "Agreements",
    "SLA Management",
    "Settlements",
    "Audit Trail",
    "Partner Command Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Governance & Partners")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: components.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.policy_outlined),
              title: Text(components[index]),
            ),
          );
        },
      ),
    );
  }
}