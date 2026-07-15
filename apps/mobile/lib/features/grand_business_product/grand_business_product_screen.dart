import "package:flutter/material.dart";

class GrandBusinessProductScreen extends StatelessWidget {
  const GrandBusinessProductScreen({super.key});

  static const domains = <String>[
    "Vehicle Marketplace",
    "Auction Platform",
    "Finance & Insurance",
    "Export & Logistics",
    "Dealer & Workshop Suite",
    "Parts & Accessories Commerce",
    "Customer Growth Platform",
    "Revenue Operations",
    "Partner Network",
    "Business Command Center"
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Grand Business Product")),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1.2,
        ),
        itemCount: domains.length,
        itemBuilder: (context, index) {
          return Card(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Text(
                  domains[index],
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