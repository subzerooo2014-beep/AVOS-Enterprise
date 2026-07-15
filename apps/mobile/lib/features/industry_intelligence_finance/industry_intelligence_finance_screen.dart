import "package:flutter/material.dart";

class IndustryIntelligenceFinanceScreen extends StatelessWidget {
  const IndustryIntelligenceFinanceScreen({super.key});

  static const components = <String>[
    "AI Valuation",
    "Pricing Intelligence",
    "Buyer Matching",
    "Seller Intelligence",
    "Fraud Intelligence",
    "Risk Intelligence",
    "Insurance Marketplace",
    "Insurance Quotes",
    "Policies",
    "Claims",
    "Finance Marketplace",
    "Loan Pre-Approval",
    "Installment Calculator",
    "Bank Integrations",
    "Credit Decisions",
    "Financial Analytics",
    "Executive Finance Dashboard",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Intelligence, Finance & Insurance")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: components.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.insights_outlined),
              title: Text(components[index]),
            ),
          );
        },
      ),
    );
  }
}