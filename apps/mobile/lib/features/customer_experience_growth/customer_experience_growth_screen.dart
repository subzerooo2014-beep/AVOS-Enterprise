import "package:flutter/material.dart";

class CustomerExperienceGrowthScreen extends StatelessWidget {
  const CustomerExperienceGrowthScreen({super.key});

  static const sections = <String>[
    "Customer 360",
    "CRM Journeys",
    "Marketing Automation",
    "Campaign Engine",
    "Push / Email / SMS",
    "Referral Engine",
    "Loyalty Automation",
    "AI Recommendations",
    "Analytics Dashboard",
    "Growth KPIs",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Customer Experience & Growth")),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1.25,
        ),
        itemCount: sections.length,
        itemBuilder: (context, index) {
          return Card(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Text(
                  sections[index],
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}