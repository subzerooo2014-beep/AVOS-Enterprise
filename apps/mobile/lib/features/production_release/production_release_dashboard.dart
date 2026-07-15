import 'package:flutter/material.dart';

class ProductionReleaseDashboard extends StatelessWidget {
  const ProductionReleaseDashboard({
    super.key,
    this.buildScore = 100,
    this.testScore = 100,
    this.certificationScore = 100,
    this.artifactScore = 100,
    this.approvalScore = 100,
    this.releaseScore = 100,
    this.releaseStatus = 'PRODUCTION READY',
  });

  final int buildScore;
  final int testScore;
  final int certificationScore;
  final int artifactScore;
  final int approvalScore;
  final int releaseScore;
  final String releaseStatus;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AVOS Production Release'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(label: 'Build', value: '$buildScore%'),
              _Metric(label: 'Tests', value: '$testScore%'),
              _Metric(
                label: 'Certification',
                value: '$certificationScore%',
              ),
              _Metric(label: 'Artifacts', value: '$artifactScore%'),
              _Metric(label: 'Approvals', value: '$approvalScore%'),
              _Metric(label: 'Release', value: '$releaseScore%'),
              _Metric(label: 'System Status', value: releaseStatus),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Release Manifest'),
          const _Capability(name: 'Release Notes'),
          const _Capability(name: 'Deployment Manifest'),
          const _Capability(name: 'Rollback Manifest'),
          const _Capability(name: 'Production Certificate'),
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
