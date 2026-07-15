import "package:flutter/material.dart";

class ConstitutionalFoundationScreen extends StatelessWidget {
  const ConstitutionalFoundationScreen({super.key});

  static const constitutions = <String>[
    "Technical Constitution",
    "Business Constitution",
    "Executive Constitution",
    "Growth Constitution",
    "Trust Constitution",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Constitutions")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: constitutions.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.account_balance_outlined),
              title: Text(constitutions[index]),
            ),
          );
        },
      ),
    );
  }
}