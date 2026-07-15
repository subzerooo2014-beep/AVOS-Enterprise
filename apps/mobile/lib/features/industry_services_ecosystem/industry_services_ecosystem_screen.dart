import "package:flutter/material.dart";

class IndustryServicesEcosystemScreen extends StatelessWidget {
  const IndustryServicesEcosystemScreen({super.key});

  static const groups = <String>[
    "Service Booking",
    "Workshop Management",
    "Technician Scheduling",
    "Maintenance Plans",
    "Repair Orders",
    "Service History",
    "Inspection",
    "Condition Reports",
    "Inspection Certificates",
    "Warranty",
    "Warranty Claims",
    "Parts Catalog",
    "Parts Orders",
    "Accessories",
    "Mobile Service",
    "Roadside Assistance",
    "Pickup & Delivery",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Industry Services Ecosystem")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: groups.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.build_circle_outlined),
              title: Text(groups[index]),
            ),
          );
        },
      ),
    );
  }
}