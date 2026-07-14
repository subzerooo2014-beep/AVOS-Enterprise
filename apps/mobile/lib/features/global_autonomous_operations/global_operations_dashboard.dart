import 'package:flutter/material.dart';

class GlobalOperationsDashboard extends StatelessWidget {
  const GlobalOperationsDashboard({
    super.key,
    this.globalReadiness = 87,
    this.activeOperations = 6,
    this.blockedOperations = 1,
    this.availableCapacity = 74,
    this.serviceHealth = 91,
  });

  final int globalReadiness;
  final int activeOperations;
  final int blockedOperations;
  final int availableCapacity;
  final int serviceHealth;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Global Operations Center')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Global Readiness',
                value: '$globalReadiness%',
              ),
              _Metric(
                label: 'Active Operations',
                value: '$activeOperations',
              ),
              _Metric(
                label: 'Blocked Operations',
                value: '$blockedOperations',
              ),
              _Metric(
                label: 'Available Capacity',
                value: '$availableCapacity%',
              ),
              _Metric(
                label: 'Service Health',
                value: '$serviceHealth%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Global Operations Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _Capability(name: 'Global Operations Orchestrator'),
          const _Capability(name: 'Autonomous Operations Scheduler'),
          const _Capability(name: 'Operational Digital Twin'),
          const _Capability(name: 'Service Orchestration Engine'),
          const _Capability(name: 'Global Enterprise Operations Center'),
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
