import "package:flutter/material.dart";

class EnterpriseMetadataPlatformScreen extends StatelessWidget {
  const EnterpriseMetadataPlatformScreen({super.key});

  static const capabilities = <String>[
    "Enterprise Metadata Platform",
    "Enterprise Data Dictionary",
    "Global Id",
    "Metadata First Architecture",
    "Central Configuration",
    "Abstraction Layer",
    "Schema Registry",
    "Metadata Lineage",
    "Semantic Catalog",
    "Metadata Governance",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Enterprise Metadata Platform")),
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