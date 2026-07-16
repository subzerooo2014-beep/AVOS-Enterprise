import "package:flutter/material.dart";

class DesignExperiencePlatformScreen extends StatelessWidget {
  const DesignExperiencePlatformScreen({super.key});

  static const capabilities = <String>[
    "Experience Genome",
    "Design Constitution",
    "Living Style Guide",
    "Brand Guardian Ai",
    "Visual Knowledge Base",
    "Experience Composer",
    "Accessibility Governance",
    "Design Token Registry",
    "Ux Quality Gate",
    "Brand Compliance",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Design and Experience Platform")),
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