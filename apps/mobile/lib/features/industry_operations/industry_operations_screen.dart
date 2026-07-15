import "package:flutter/material.dart";

class IndustryOperationsScreen extends StatelessWidget {
  const IndustryOperationsScreen({super.key});

  static const components = <String>[
    "Order Management",
    "Inventory",
    "Reservations",
    "Fulfillment",
    "Service Execution",
    "Maintenance Operations",
    "Inspection Operations",
    "Logistics Operations",
    "Delivery & Handover",
    "SLA Management",
    "Exception Management",
    "Operations Command Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Industry Operations")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: components.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.precision_manufacturing_outlined),
              title: Text(components[index]),
            ),
          );
        },
      ),
    );
  }
}