import "package:flutter/material.dart";

class UnifiedBusinessOperationsScreen extends StatelessWidget {
  const UnifiedBusinessOperationsScreen({super.key});

  static const capabilities = <String>[
    "Workflows",
    "Automation",
    "Approvals",
    "Cross-Module Integrations",
    "Process Templates",
    "Command Center",
    "Enterprise Alerts",
    "AI Operations",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Unified Business Operations")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: capabilities.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.account_tree_outlined),
              title: Text(capabilities[index]),
            ),
          );
        },
      ),
    );
  }
}