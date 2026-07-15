import "package:flutter/material.dart";

class IndustryCommerceRevenueScreen extends StatelessWidget {
  const IndustryCommerceRevenueScreen({super.key});

  static const components = <String>[
    "Industry Offers",
    "Industry Pricing",
    "Subscriptions",
    "Payments",
    "Commissions",
    "Platform Fees",
    "Revenue Protection",
    "Leakage Detection",
    "Revenue Analytics",
    "Settlement Foundation",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Industry Commerce & Revenue")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: components.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.payments_outlined),
              title: Text(components[index]),
            ),
          );
        },
      ),
    );
  }
}