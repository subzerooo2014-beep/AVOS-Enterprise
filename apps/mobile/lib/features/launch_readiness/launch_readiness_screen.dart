import "package:flutter/material.dart";

class LaunchReadinessScreen extends StatelessWidget {
  const LaunchReadinessScreen({super.key});

  static const sections = <String>[
    "Pricing & Plans",
    "Subscriptions",
    "Billing & Invoices",
    "Tenant Activation",
    "Launch Checklist",
    "Support & SLA",
    "Launch KPIs",
    "Executive Dashboard",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Launch Readiness")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: sections.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.rocket_launch_outlined),
              title: Text(sections[index]),
            ),
          );
        },
      ),
    );
  }
}