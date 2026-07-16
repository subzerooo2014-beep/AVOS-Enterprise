import "package:flutter/material.dart";

class CoreFoundationStackScreen extends StatelessWidget {
  const CoreFoundationStackScreen({super.key});

  static const capabilities = <String>[
    "Vision Foundation",
    "Brand Foundation",
    "Constitution Foundation",
    "Strategy Foundation",
    "Platform Foundation",
    "Product Architecture Foundation",
    "Product Development Foundation",
    "Foundation Registry",
    "Foundation Evidence",
    "Foundation Governance",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Core Foundation Stack")),
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