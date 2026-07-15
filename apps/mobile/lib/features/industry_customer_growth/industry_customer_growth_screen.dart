import "package:flutter/material.dart";

class IndustryCustomerGrowthScreen extends StatelessWidget {
  const IndustryCustomerGrowthScreen({super.key});

  static const components = <String>[
    "Customer 360",
    "CRM Journeys",
    "Customer Lifecycle",
    "Trust Score",
    "Reviews & Reputation",
    "Referrals",
    "Loyalty",
    "Campaigns",
    "Notifications",
    "AI Recommendations",
    "Retention",
    "Churn Detection",
    "Growth Analytics",
    "Customer Success",
    "Growth Command Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Customer, Trust & Growth")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: components.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.groups_outlined),
              title: Text(components[index]),
            ),
          );
        },
      ),
    );
  }
}