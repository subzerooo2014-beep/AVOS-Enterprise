import 'package:flutter/material.dart';

class AuctionExportDashboard extends StatelessWidget {
  const AuctionExportDashboard({
    super.key,
    this.liveAuctions = 12,
    this.validBids = 84,
    this.exportEligibleVehicles = 31,
    this.activeShipments = 9,
    this.settlementRate = 91,
  });

  final int liveAuctions;
  final int validBids;
  final int exportEligibleVehicles;
  final int activeShipments;
  final int settlementRate;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Auctions & Export Logistics'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(label: 'Live Auctions', value: '$liveAuctions'),
              _Metric(label: 'Valid Bids', value: '$validBids'),
              _Metric(
                label: 'Export Eligible',
                value: '$exportEligibleVehicles',
              ),
              _Metric(
                label: 'Active Shipments',
                value: '$activeShipments',
              ),
              _Metric(
                label: 'Settlement Rate',
                value: '$settlementRate%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Auction Lifecycle'),
          const _Capability(name: 'Live Bidding'),
          const _Capability(name: 'Export Eligibility'),
          const _Capability(name: 'Shipping Coordination'),
          const _Capability(name: 'Customs & Tracking'),
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
