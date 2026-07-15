import "package:flutter/material.dart";

class StrategicFoundationScreen extends StatelessWidget {
  const StrategicFoundationScreen({super.key});

  static const foundations = <String>[
    "Core Platform",
    "Business Foundation",
    "Governance Foundation",
    "Executive Foundation",
    "Growth Foundation",
    "Trust Foundation",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Strategic Foundation")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: foundations.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.account_tree_outlined),
              title: Text(foundations[index]),
            ),
          );
        },
      ),
    );
  }
}