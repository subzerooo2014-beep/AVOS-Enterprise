import "package:flutter/material.dart";

class EnterpriseProductSuitesScreen extends StatelessWidget {
  const EnterpriseProductSuitesScreen({super.key});

  static const suites = <String>[
    "Enterprise CRM Suite",
    "Enterprise ERP Suite",
    "Marketplace Suite",
    "AI Enterprise Suite",
    "Industry Packs",
    "Global SaaS Platform",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Enterprise Product Suites")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: suites.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.apps_outlined),
              title: Text(suites[index]),
            ),
          );
        },
      ),
    );
  }
}