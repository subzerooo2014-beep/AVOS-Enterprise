import "package:flutter/material.dart";

class GlobalEnterprisePlatformScreen extends StatelessWidget {
  const GlobalEnterprisePlatformScreen({super.key});

  static const capabilities = <String>[
    "Tenant Federation",
    "Master Data Hub",
    "Customer 360",
    "Asset Registry",
    "Identity & Access",
    "Workflow Hub",
    "AI Orchestrator",
    "Notification Center",
    "Document Center",
    "Search Engine",
    "Analytics & BI",
    "Audit & Compliance",
    "Integration Hub",
    "API Gateway",
    "Event Streaming",
    "Scheduler",
    "Automation Center",
    "Configuration Center",
    "Feature Flags",
    "Plugin Marketplace",
    "Licensing",
    "Billing",
    "Multi-Region",
    "Disaster Recovery",
    "Backup & Restore",
    "Observability",
    "Enterprise Health",
    "AI Governance",
    "Command Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Global Enterprise Platform")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Global Platform",
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 16),
          ...capabilities.map(
            (capability) => Card(
              child: ListTile(
                leading: const Icon(Icons.hub_outlined),
                title: Text(capability),
              ),
            ),
          ),
        ],
      ),
    );
  }
}