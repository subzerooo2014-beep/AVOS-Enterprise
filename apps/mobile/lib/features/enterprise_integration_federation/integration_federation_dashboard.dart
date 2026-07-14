import 'package:flutter/material.dart';

class IntegrationFederationDashboard extends StatelessWidget {
  const IntegrationFederationDashboard({
    super.key,
    this.integrationHealth = 88,
    this.activeConnectors = 18,
    this.federationHealth = 84,
    this.synchronizationScore = 91,
    this.securityScore = 89,
    this.connectedRegions = 4,
  });

  final int integrationHealth;
  final int activeConnectors;
  final int federationHealth;
  final int synchronizationScore;
  final int securityScore;
  final int connectedRegions;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Integration & Federation')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Integration Health',
                value: '$integrationHealth%',
              ),
              _Metric(
                label: 'Active Connectors',
                value: '$activeConnectors',
              ),
              _Metric(
                label: 'Federation Health',
                value: '$federationHealth%',
              ),
              _Metric(
                label: 'Synchronization',
                value: '$synchronizationScore%',
              ),
              _Metric(
                label: 'Security Score',
                value: '$securityScore%',
              ),
              _Metric(
                label: 'Connected Regions',
                value: '$connectedRegions',
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Integration Foundation Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _Capability(name: 'Enterprise Integration Hub'),
          const _Capability(name: 'Universal Connector Framework'),
          const _Capability(name: 'Federation Management Engine'),
          const _Capability(name: 'Event Federation'),
          const _Capability(name: 'Global Connectivity Center'),
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
