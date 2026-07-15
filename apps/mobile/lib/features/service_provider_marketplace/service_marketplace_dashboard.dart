import 'package:flutter/material.dart';

class ServiceMarketplaceDashboard extends StatelessWidget {
  const ServiceMarketplaceDashboard({
    super.key,
    this.activeServices = 76,
    this.verifiedProviders = 24,
    this.confirmedBookings = 19,
    this.averageSlaCompliance = 93,
    this.openComplaints = 2,
  });

  final int activeServices;
  final int verifiedProviders;
  final int confirmedBookings;
  final int averageSlaCompliance;
  final int openComplaints;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Services & Providers'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Active Services',
                value: '$activeServices',
              ),
              _Metric(
                label: 'Verified Providers',
                value: '$verifiedProviders',
              ),
              _Metric(
                label: 'Confirmed Bookings',
                value: '$confirmedBookings',
              ),
              _Metric(
                label: 'SLA Compliance',
                value: '$averageSlaCompliance%',
              ),
              _Metric(
                label: 'Open Complaints',
                value: '$openComplaints',
              ),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Service Catalog'),
          const _Capability(name: 'Workshop Profiles'),
          const _Capability(name: 'Booking & Scheduling'),
          const _Capability(name: 'Provider Performance'),
          const _Capability(name: 'Complaints & Claims'),
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
