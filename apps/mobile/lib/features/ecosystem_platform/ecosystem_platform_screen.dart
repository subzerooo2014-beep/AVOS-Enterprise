import "package:flutter/material.dart";

class EcosystemPlatformScreen extends StatelessWidget {
  const EcosystemPlatformScreen({super.key});

  static const capabilities = <String>[
    "Developer Platform",
    "SDK Center",
    "Public API Management",
    "Webhooks Platform",
    "Event Bus Federation",
    "Integration Marketplace",
    "Partner Portal",
    "Vendor Portal",
    "Customer Portal",
    "White Label Platform",
    "Multi-Tenant Provisioning",
    "Organization Management",
    "Identity Federation",
    "API Keys & Secrets Vault",
    "OAuth Management",
    "App Marketplace",
    "Extension SDK",
    "Plugin Runtime",
    "Plugin Registry",
    "Connector Framework",
    "ERP/CRM Connectors",
    "Payment Connectors",
    "Messaging Connectors",
    "AI Provider Connectors",
    "External Search Connectors",
    "Low-Code Automation Studio",
    "Workflow Marketplace",
    "Enterprise Templates",
    "Solution Marketplace",
    "Ecosystem Command Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Ecosystem Platform")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Ecosystem Platform",
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 16),
          ...capabilities.map(
            (capability) => Card(
              child: ListTile(
                leading: const Icon(Icons.extension_outlined),
                title: Text(capability),
              ),
            ),
          ),
        ],
      ),
    );
  }
}