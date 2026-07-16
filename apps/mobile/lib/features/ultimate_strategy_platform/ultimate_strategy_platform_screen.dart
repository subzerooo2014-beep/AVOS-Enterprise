import "package:flutter/material.dart";

class UltimateStrategyPlatformScreen extends StatelessWidget {
  const UltimateStrategyPlatformScreen({super.key});

  static const capabilities = <String>[
    "Strategic Portfolio Manager",
    "Investment Analyzer",
    "Ma Center",
    "Venture Studio",
    "Future Scenario Center",
    "Transformation Office",
    "Platform Maturity Dashboard",
    "Ultimate Command Center",
    "Strategic Risk Radar",
    "Executive Evidence",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Ultimate Strategy Platform")),
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