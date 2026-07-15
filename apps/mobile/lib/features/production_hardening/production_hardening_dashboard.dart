import 'package:flutter/material.dart';

class ProductionHardeningDashboard extends StatelessWidget {
  const ProductionHardeningDashboard({
    super.key,
    this.securityScore = 100,
    this.performanceScore = 95,
    this.scalabilityScore = 100,
    this.reliabilityScore = 100,
    this.recoveryScore = 100,
    this.observabilityScore = 100,
    this.productionReadinessScore = 99,
  });

  final int securityScore;
  final int performanceScore;
  final int scalabilityScore;
  final int reliabilityScore;
  final int recoveryScore;
  final int observabilityScore;
  final int productionReadinessScore;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Production Hardening'),
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
              _Metric(label: 'Scalability', value: '$scalabilityScore%'),
              _Metric(label: 'Reliability', value: '$reliabilityScore%'),
              _Metric(label: 'Recovery', value: '$recoveryScore%'),
              _Metric(label: 'Observability', value: '$observabilityScore%'),
              _Metric(
                label: 'Production Readiness',
                value: '$productionReadinessScore%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Security Hardening'),
          const _Capability(name: 'Performance Profiling'),
          const _Capability(name: 'Reliability & Resilience'),
          const _Capability(name: 'Disaster Recovery'),
          const _Capability(name: 'Observability Readiness'),
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
