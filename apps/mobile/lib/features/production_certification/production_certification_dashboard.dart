import 'package:flutter/material.dart';

class ProductionCertificationDashboard extends StatelessWidget {
  const ProductionCertificationDashboard({
    super.key,
    this.securityScore = 100,
    this.performanceScore = 100,
    this.complianceScore = 100,
    this.loadTestScore = 100,
    this.signoffScore = 100,
    this.certificationScore = 100,
    this.releaseStatus = 'Certified',
  });

  final int securityScore;
  final int performanceScore;
  final int complianceScore;
  final int loadTestScore;
  final int signoffScore;
  final int certificationScore;
  final String releaseStatus;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Production Certification'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(label: 'Security', value: '$securityScore%'),
              _Metric(label: 'Performance', value: '$performanceScore%'),
              _Metric(label: 'Compliance', value: '$complianceScore%'),
              _Metric(label: 'Load Tests', value: '$loadTestScore%'),
              _Metric(label: 'Sign-offs', value: '$signoffScore%'),
              _Metric(
                label: 'Certification',
                value: '$certificationScore%',
              ),
              _Metric(label: 'Release Status', value: releaseStatus),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Security Certification'),
          const _Capability(name: 'Performance Certification'),
          const _Capability(name: 'Compliance Certification'),
          const _Capability(name: 'Executive Sign-off'),
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
