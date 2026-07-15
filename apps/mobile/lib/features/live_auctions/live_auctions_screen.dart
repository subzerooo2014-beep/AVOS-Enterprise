import "package:flutter/material.dart";

class LiveAuctionsScreen extends StatelessWidget {
  const LiveAuctionsScreen({super.key});

  static const capabilities = <String>[
    "Live Auctions",
    "Real-Time Bidding",
    "Proxy Bidding",
    "Buy Now",
    "Reserve Price",
    "Anti-Sniping",
    "Bid History",
    "AI Recommendations",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Live Auctions")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: capabilities.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.gavel_outlined),
              title: Text(capabilities[index]),
            ),
          );
        },
      ),
    );
  }
}