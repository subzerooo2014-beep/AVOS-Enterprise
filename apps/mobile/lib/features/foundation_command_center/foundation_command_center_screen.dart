import "package:flutter/material.dart";

class FoundationCommandCenterScreen extends StatelessWidget {
  const FoundationCommandCenterScreen({super.key});

  static const sections = <String>[
    "Foundation Master Registry",
    "Product Lifecycle",
    "Architecture Decisions",
    "Standards & Policies",
    "Production Readiness",
    "Release Approval",
    "Operations",
    "Continuous Evolution",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Foundation Command Center")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Foundation Mega Bundle",
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 16),
          ...sections.map(
            (item) => Card(
              child: ListTile(
                leading: const Icon(Icons.account_tree_outlined),
                title: Text(item),
              ),
            ),
          ),
        ],
      ),
    );
  }
}