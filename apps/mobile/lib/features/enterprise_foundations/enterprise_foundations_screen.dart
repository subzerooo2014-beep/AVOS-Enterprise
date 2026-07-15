import "package:flutter/material.dart";

class EnterpriseFoundationsScreen extends StatelessWidget {
  const EnterpriseFoundationsScreen({super.key});

  static const foundations = <String>[
    "Data & AI Core",
    "Runtime & Integration Core",
    "Identity & Multi-Tenancy Core",
    "Developer / API / Plugin Core",
    "Legal & Global Operations Core",
    "Security, Observability & Experience Core",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Enterprise Foundations")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: foundations.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.foundation_outlined),
              title: Text(foundations[index]),
            ),
          );
        },
      ),
    );
  }
}