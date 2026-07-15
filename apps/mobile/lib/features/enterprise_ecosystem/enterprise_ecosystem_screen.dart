import "package:flutter/material.dart";

class EnterpriseEcosystemScreen extends StatelessWidget {
  const EnterpriseEcosystemScreen({super.key});

  static const hubs = <String>[
    "Banking Hub",
    "Insurance Hub",
    "Export & Logistics Hub",
    "Government Services Gateway",
    "Dealer Network",
    "Workshop Network",
    "Fleet Management",
    "Auctions Hub",
    "AI Partner Marketplace",
    "Enterprise Integrations"
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Enterprise Ecosystem")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: hubs.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.hub_outlined),
              title: Text(hubs[index]),
              trailing: const Icon(Icons.chevron_right),
            ),
          );
        },
      ),
    );
  }
}