import 'package:flutter/material.dart';

class ResilienceContinuityDashboard extends StatelessWidget {
  const ResilienceContinuityDashboard({
    super.key,
    this.resilienceScore = 86,
    this.riskExposure = 24,
    this.continuityReadiness = 82,
    this.activeIncidents = 1,
    this.recoveryCapacity = 79,
  });

  final int resilienceScore;
  final int riskExposure;
  final int continuityReadiness;
  final int activeIncidents;
  final int recoveryCapacity;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Enterprise Resilience')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Resilience Score',
                value: '$resilienceScore%',
              ),
              _Metric(
                label: 'Risk Exposure',
                value: '$riskExposure',
              ),
              _Metric(
                label: 'Continuity Readiness',
                value: '$continuityReadiness%',
              ),
              _Metric(
                label: 'Active Incidents',
                value: '$activeIncidents',
              ),
              _Metric(
                label: 'Recovery Capacity',
                value: '$recoveryCapacity%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Resilience & Continuity Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _Capability(name: 'Enterprise Resilience Engine'),
          const _Capability(name: 'Autonomous Crisis Response'),
          const _Capability(name: 'Failure Prediction Engine'),
          const _Capability(name: 'Self-Healing Runtime'),
          const _Capability(name: 'Disaster Recovery Intelligence'),
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
