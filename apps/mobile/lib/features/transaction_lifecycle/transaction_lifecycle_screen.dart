import "package:flutter/material.dart";

class TransactionLifecycleScreen extends StatelessWidget {
  const TransactionLifecycleScreen({super.key});

  static const domains = <String>[
    "Reservation Engine",
    "Identity & KYC",
    "Inspection & Certification",
    "Contracting & E-Sign",
    "Escrow & Settlement",
    "Ownership Transfer",
    "Delivery & Handover",
    "Digital Vehicle Passport",
    "Dispute Resolution",
    "After-Sales Care",
    "Trade-In Engine",
    "Transaction Command Center"
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Transaction Lifecycle")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: domains.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.swap_horiz),
              title: Text(domains[index]),
              trailing: const Icon(Icons.chevron_right),
            ),
          );
        },
      ),
    );
  }
}