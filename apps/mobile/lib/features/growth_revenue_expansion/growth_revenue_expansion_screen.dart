import "package:flutter/material.dart";

class GrowthRevenueExpansionScreen extends StatelessWidget {
  const GrowthRevenueExpansionScreen({super.key});

  static const capabilities = <String>[
    "Growth Brain",
    "Acquisition Engine",
    "Retention Engine",
    "Referral Engine",
    "Viral Engine",
    "SEO Engine",
    "Content Factory",
    "Social Distribution AI",
    "Influencer Hub",
    "Ads Optimization AI",
    "Campaign Orchestration",
    "Experimentation",
    "A/B Testing AI",
    "Conversion Optimization",
    "Customer Lifecycle",
    "Loyalty Engine",
    "Personalization",
    "Notification Intelligence",
    "Revenue Optimizer",
    "Adaptive Pricing",
    "Monetization Engine",
    "Subscription Growth",
    "Upsell & Cross-Sell",
    "Market Expansion AI",
    "Localization",
    "Competitor Intelligence",
    "Demand Forecasting",
    "Growth Analytics",
    "Unit Economics",
    "Growth Command Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Growth & Revenue")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Growth Platform",
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 16),
          ...capabilities.map(
            (capability) => Card(
              child: ListTile(
                leading: const Icon(Icons.trending_up_outlined),
                title: Text(capability),
              ),
            ),
          ),
        ],
      ),
    );
  }
}