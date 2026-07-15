import "package:flutter/material.dart";

class ExportShippingScreen extends StatelessWidget {
  const ExportShippingScreen({super.key});

  static const capabilities = <String>[
    "Export Cases",
    "Shipping Quotes",
    "Carrier Matching",
    "Customs",
    "Documents",
    "Shipment Tracking",
    "Delivery",
    "Exceptions",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Export & Shipping")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: capabilities.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.local_shipping_outlined),
              title: Text(capabilities[index]),
            ),
          );
        },
      ),
    );
  }
}