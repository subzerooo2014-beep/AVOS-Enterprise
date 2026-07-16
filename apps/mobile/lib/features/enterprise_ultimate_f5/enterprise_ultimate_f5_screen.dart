import "package:flutter/material.dart";

class EnterpriseUltimateF5Screen extends StatelessWidget {
  const EnterpriseUltimateF5Screen({super.key});

  static const capabilities = <String>[
    "AVOS Smart Workspace",
    "AVOS Live Command",
    "AVOS Cockpit",
    "AVOS Story Mode",
    "AVOS Business Pulse",
    "AVOS AI Inbox",
    "AVOS Daily Mission",
    "AVOS Live Activity Feed",
    "AVOS Office View",
    "Digital Employees",
    "Sales Manager AI",
    "Finance Manager AI",
    "Marketing Manager AI",
    "Inventory Manager AI",
    "CEO Advisor AI",
    "AI Daily Briefing",
    "AI One Click",
    "Role-Based Dashboards",
    "Customizable Layouts",
    "Advertisement Analytics",
    "Vehicle 360",
    "Customer 360",
    "Dealer 360",
    "Market 360",
    "AI 360",
    "Unified Timeline",
    "Mission Control",
    "Command Palette",
    "Global Search",
    "Personalization",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Enterprise Ultimate F5")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: capabilities
            .map(
              (item) => Card(
                child: ListTile(
                  leading: const Icon(Icons.space_dashboard_outlined),
                  title: Text(item),
                ),
              ),
            )
            .toList(),
      ),
    );
  }
}