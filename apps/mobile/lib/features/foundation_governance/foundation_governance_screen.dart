import "package:flutter/material.dart";

class FoundationGovernanceScreen extends StatelessWidget {
  const FoundationGovernanceScreen({super.key});

  static const stages = <String>[
    "Vision",
    "Brand Identity",
    "Brand DNA",
    "Design System",
    "Constitutional Foundation",
    "Strategic Foundation",
    "Platform Foundation",
    "Product Architecture",
    "Product Development",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Foundation Governance"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Foundation Governance",
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            "Mandatory conformance control for every AVOS product.",
          ),
          const SizedBox(height: 20),
          ...stages.indexed.map(
            (entry) => Card(
              child: ListTile(
                leading: CircleAvatar(
                  child: Text("${entry.$1 + 1}"),
                ),
                title: Text(entry.$2),
                trailing: const Icon(Icons.verified_outlined),
              ),
            ),
          ),
        ],
      ),
    );
  }
}