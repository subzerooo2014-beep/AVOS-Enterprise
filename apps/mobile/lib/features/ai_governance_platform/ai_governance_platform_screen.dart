import "package:flutter/material.dart";

class AiGovernancePlatformScreen extends StatelessWidget {
  const AiGovernancePlatformScreen({super.key});

  static const capabilities = <String>[
    "Ai Governance Center",
    "Model Registry",
    "Feature Store",
    "Prompt Registry",
    "Ai Evaluation Platform",
    "Ai Policy Enforcement",
    "Responsible Ai Center",
    "Model Risk Management",
    "Ai Audit Trail",
    "Ai Guardrails",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS AI Governance Platform")),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: capabilities.length,
        itemBuilder: (context, index) => Card(
          child: ListTile(
            leading: const Icon(Icons.auto_awesome),
            title: Text(capabilities[index]),
          ),
        ),
      ),
    );
  }
}