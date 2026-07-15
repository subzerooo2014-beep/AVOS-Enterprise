import "package:flutter/material.dart";

class CommercialLaunchScreen extends StatelessWidget {
  const CommercialLaunchScreen({super.key});

  static const capabilities = <String>[
    "Commercial Launch Center",
    "Multi-Tenant Enterprise Management",
    "User & Role Management",
    "Identity / SSO / MFA",
    "Real Subscription Activation",
    "Revenue Operations Center",
    "Executive Business Dashboard",
    "Business Intelligence & KPIs",
    "AI Operations Center",
    "Multi-Country / Multi-Currency",
    "Multi-Language",
    "Mobile Release Center",
    "Web Release Center",
    "App Marketplace",
    "Plugin Marketplace",
    "Partner Onboarding",
    "Banking Connections",
    "Insurance Connections",
    "Export & Logistics Connections",
    "Government Gateway Connections",
    "Marketing Launch Center",
    "Growth Engine",
    "Reputation & Reviews",
    "Customer Communication Center",
    "Support & Ticket Center",
    "Compliance Center",
    "Financial Reporting",
    "AI Business Insights",
    "Live Monitoring Center",
    "Operations Command Center"
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Commercial Launch")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: capabilities.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.rocket_launch_outlined),
              title: Text(capabilities[index]),
              trailing: const Icon(Icons.chevron_right),
            ),
          );
        },
      ),
    );
  }
}