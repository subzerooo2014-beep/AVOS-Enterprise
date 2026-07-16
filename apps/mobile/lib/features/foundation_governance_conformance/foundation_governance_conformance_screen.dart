import "package:flutter/material.dart";

class FoundationGovernanceConformanceScreen extends StatelessWidget {
  const FoundationGovernanceConformanceScreen({super.key});

  static const capabilities = <String>[
    "Evidence Based Conformance",
    "Mandatory Stage Ordering",
    "Production Readiness Gates",
    "Architecture Conformance",
    "Governance Validation",
    "Stage Dependency Control",
    "Conformance Reporting",
    "Exception Management",
    "Approval Gates",
    "Audit Evidence",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Foundation Governance and Conformance")),
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