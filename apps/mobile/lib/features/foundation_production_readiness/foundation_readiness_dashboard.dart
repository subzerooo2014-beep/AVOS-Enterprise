import 'package:flutter/material.dart';

class FoundationReadinessDashboard extends StatelessWidget {
  const FoundationReadinessDashboard({
    super.key,
    this.foundationScore = 100,
    this.architectureScore = 100,
    this.securityScore = 100,
    this.dataScore = 100,
    this.operationsScore = 100,
    this.releaseStatus = 'READY',
  });

  final int foundationScore;
  final int architectureScore;
  final int securityScore;
  final int dataScore;
  final int operationsScore;
  final String releaseStatus;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Foundation Readiness')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Text(
                    'AVOS Foundation Complete',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    releaseStatus,
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Foundation Score',
                value: '$foundationScore%',
              ),
              _Metric(
                label: 'Architecture',
                value: '$architectureScore%',
              ),
              _Metric(
                label: 'Security',
                value: '$securityScore%',
              ),
              _Metric(
                label: 'Data',
                value: '$dataScore%',
              ),
              _Metric(
                label: 'Operations',
                value: '$operationsScore%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Foundation Integrity'),
          const _Capability(name: 'Architecture Conformance'),
          const _Capability(name: 'Production Readiness'),
          const _Capability(name: 'End-to-End Validation'),
          const _Capability(name: 'Completion Certificate'),
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
