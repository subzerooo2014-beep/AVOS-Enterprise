import "package:flutter/material.dart";

class BrandFoundationScreen extends StatelessWidget {
  const BrandFoundationScreen({super.key});

  static const foundationOrder = <String>[
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

  static const traits = <String>[
    "Premium",
    "AI First",
    "Global",
    "Trusted",
    "Intelligent",
    "Scalable",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Brand Foundation"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Enterprise",
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            "The Operating System for Mobility",
            style: TextStyle(fontSize: 18),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: traits
                .map((trait) => Chip(label: Text(trait)))
                .toList(),
          ),
          const SizedBox(height: 24),
          const Text(
            "Mandatory Foundation Order",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 12),
          ...foundationOrder.indexed.map(
            (entry) => Card(
              child: ListTile(
                leading: CircleAvatar(
                  child: Text("${entry.$1 + 1}"),
                ),
                title: Text(entry.$2),
              ),
            ),
          ),
        ],
      ),
    );
  }
}