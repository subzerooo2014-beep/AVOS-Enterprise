import "package:flutter/material.dart";

class UniversalDataFabricScreen extends StatelessWidget {
  const UniversalDataFabricScreen({super.key});

  static const capabilities = <String>[
    "Master Data Hub",
    "Universal Customer 360",
    "Universal Asset Registry",
    "Enterprise Data Fabric",
    "Enterprise Search Fabric",
    "Data Lineage",
    "Data Quality",
    "Schema Federation",
    "Real Time Data Mesh",
    "Data Governance",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Universal Data Fabric")),
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