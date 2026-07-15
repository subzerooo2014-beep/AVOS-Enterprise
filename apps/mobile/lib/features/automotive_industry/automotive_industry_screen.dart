import "package:flutter/material.dart";

class AutomotiveIndustryScreen extends StatelessWidget {
  const AutomotiveIndustryScreen({super.key});

  static const sections = <String>[
    "Vehicles",
    "Inventory",
    "Listings",
    "Trade-In",
    "Service",
    "Finance",
    "Logistics",
    "Vehicle AI",
    "Dashboard",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Automotive Industry")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: sections.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.directions_car_outlined),
              title: Text(sections[index]),
            ),
          );
        },
      ),
    );
  }
}