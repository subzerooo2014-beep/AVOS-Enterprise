import "package:flutter/material.dart";

class MarketplaceExecutionScreen extends StatelessWidget {
  const MarketplaceExecutionScreen({super.key});

  static const groups = <String>[
    "Checkout & Cart",
    "Reservations & Bookings",
    "Offers & Negotiation",
    "Contracts & Signatures",
    "Payments",
    "Orders",
    "Fulfillment",
    "Delivery",
    "Export",
    "Shipment Tracking",
    "Chats",
    "Notifications",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Marketplace Execution")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: groups.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
              leading: const Icon(Icons.shopping_cart_checkout_outlined),
              title: Text(groups[index]),
            ),
          );
        },
      ),
    );
  }
}