import "package:flutter/material.dart";

class FoundationCoreScreen extends StatelessWidget {
  const FoundationCoreScreen({super.key});

  static const foundations = <String>[
    "Core Platform",
    "Industry Architecture",
    "Commerce",
    "Revenue",
    "Revenue Protection",
    "Audit & Tracking",
    "Governance & Permissions",
    "Event Tracking",
    "Lead → Deal Pipeline",
    "Shared Capabilities",
    "Command Center",
    "Owner AI",
    "Executive Dashboard",
    "Business Intelligence",
    "Constitution & Governance",
    "Executive Management",
    "Platform Registry",
    "Industry Registry",
    "Capability Registry",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Foundation Core")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: foundations.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.account_tree_outlined),
              title: Text(foundations[index]),
            ),
          );
        },
      ),
    );
  }
}