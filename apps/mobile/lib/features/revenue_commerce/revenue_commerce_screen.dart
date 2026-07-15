import "package:flutter/material.dart";

class RevenueCommerceScreen extends StatelessWidget {
  const RevenueCommerceScreen({super.key});

  static const sections = <String>[
    "Subscriptions",
    "Billing",
    "Payments",
    "Commissions",
    "Paid Advertising",
    "Coupons",
    "Refunds",
    "Revenue Analytics",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Revenue & Commerce")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: sections.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.payments_outlined),
              title: Text(sections[index]),
              trailing: const Icon(Icons.chevron_right),
            ),
          );
        },
      ),
    );
  }
}