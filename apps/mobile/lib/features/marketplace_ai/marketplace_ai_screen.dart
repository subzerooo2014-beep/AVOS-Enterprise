import "package:flutter/material.dart";

class MarketplaceAiScreen extends StatelessWidget {
  const MarketplaceAiScreen({super.key});

  static const capabilities = <String>[
    "AI Search",
    "Semantic Matching",
    "Trust Ranking",
    "Recommendations",
    "Recently Viewed",
    "Marketplace Analytics",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Marketplace AI")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: capabilities.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.search),
              title: Text(capabilities[index]),
            ),
          );
        },
      ),
    );
  }
}