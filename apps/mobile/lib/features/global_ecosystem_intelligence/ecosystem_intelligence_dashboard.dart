import 'package:flutter/material.dart';

class EcosystemIntelligenceDashboard extends StatelessWidget {
  const EcosystemIntelligenceDashboard({
    super.key,
    this.ecosystemHealth = 86,
    this.activePartners = 24,
    this.atRiskPartners = 2,
    this.trustScore = 88,
    this.integrationHealth = 84,
  });

  final int ecosystemHealth;
  final int activePartners;
  final int atRiskPartners;
  final int trustScore;
  final int integrationHealth;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Global Ecosystem Intelligence')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Ecosystem Health',
                value: '$ecosystemHealth%',
              ),
              _Metric(
                label: 'Active Partners',
                value: '$activePartners',
              ),
              _Metric(
                label: 'At-Risk Partners',
                value: '$atRiskPartners',
              ),
              _Metric(
                label: 'Trust Score',
                value: '$trustScore%',
              ),
              _Metric(
                label: 'Integration Health',
                value: '$integrationHealth%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Global Ecosystem Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _Capability(name: 'Partner Intelligence'),
          const _Capability(name: 'External Intelligence Fusion'),
          const _Capability(name: 'Enterprise Federation Engine'),
          const _Capability(name: 'Marketplace Intelligence'),
          const _Capability(name: 'Global Ecosystem Command Center'),
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
              Text(value, style: Theme.of(context).textTheme.headlineMedium),
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
