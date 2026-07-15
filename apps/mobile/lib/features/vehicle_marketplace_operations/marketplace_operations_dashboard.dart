import 'package:flutter/material.dart';

class MarketplaceOperationsDashboard extends StatelessWidget {
  const MarketplaceOperationsDashboard({
    super.key,
    this.publishedListings = 128,
    this.activeInventory = 96,
    this.priceConfidence = 87,
    this.fraudRisk = 8,
    this.conversionRate = 12.4,
  });

  final int publishedListings;
  final int activeInventory;
  final int priceConfidence;
  final int fraudRisk;
  final double conversionRate;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Vehicle Marketplace Operations'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Published Listings',
                value: '$publishedListings',
              ),
              _Metric(
                label: 'Active Inventory',
                value: '$activeInventory',
              ),
              _Metric(
                label: 'Price Confidence',
                value: '$priceConfidence%',
              ),
              _Metric(
                label: 'Fraud Risk',
                value: '$fraudRisk%',
              ),
              _Metric(
                label: 'Conversion Rate',
                value: '${conversionRate.toStringAsFixed(1)}%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Listing Lifecycle'),
          const _Capability(name: 'Media Management'),
          const _Capability(name: 'Smart Pricing'),
          const _Capability(name: 'Marketplace Search'),
          const _Capability(name: 'Fraud Protection'),
        ],
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 210,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label),
              const SizedBox(height: 8),
              Text(
                value,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Capability extends StatelessWidget {
  const _Capability({required this.name});

  final String name;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(name),
        trailing: const Text('Operational'),
      ),
    );
  }
}
