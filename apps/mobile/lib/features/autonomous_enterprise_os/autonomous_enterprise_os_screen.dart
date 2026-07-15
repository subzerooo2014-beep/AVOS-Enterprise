import "package:flutter/material.dart";

class AutonomousEnterpriseOsScreen extends StatelessWidget {
  const AutonomousEnterpriseOsScreen({super.key});

  static const domains = <String>[
    "Autonomous AI",
    "Enterprise Swarm",
    "Self Evolution",
    "Enterprise Brain V3",
    "Global Operations",
    "AI Economy",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Autonomous Enterprise OS")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Autonomous Enterprise OS Ultimate V1",
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 16),
          ...domains.map(
            (domain) => Card(
              child: ListTile(
                leading: const Icon(Icons.auto_awesome_outlined),
                title: Text(domain),
              ),
            ),
          ),
        ],
      ),
    );
  }
}