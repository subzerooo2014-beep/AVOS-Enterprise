import "package:flutter/material.dart";

class EnterprisePlatformUltimateScreen extends StatelessWidget {
  const EnterprisePlatformUltimateScreen({super.key});

  static const domains = <String>[
    "Enterprise AI Agents OS",
    "Knowledge & Digital Twin",
    "Enterprise Automation OS",
    "Enterprise Security OS",
    "Enterprise Cloud OS",
    "Enterprise Marketplace OS",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Enterprise Platform Ultimate")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Enterprise Platform Ultimate Bundle V1",
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 16),
          ...domains.map(
            (domain) => Card(
              child: ListTile(
                leading: const Icon(Icons.layers_outlined),
                title: Text(domain),
              ),
            ),
          ),
        ],
      ),
    );
  }
}