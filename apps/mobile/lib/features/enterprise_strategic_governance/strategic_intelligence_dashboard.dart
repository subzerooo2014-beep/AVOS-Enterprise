import 'package:flutter/material.dart';

class StrategicIntelligenceDashboard extends StatelessWidget {
  const StrategicIntelligenceDashboard({
    super.key,
    this.strategyScore = 82,
    this.objectiveCompletion = 74,
    this.kpiHealth = 79,
    this.riskExposure = 28,
  });

  final int strategyScore;
  final int objectiveCompletion;
  final int kpiHealth;
  final int riskExposure;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Strategic Governance')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(label: 'Strategy Score', value: '$strategyScore%'),
              _Metric(
                label: 'Objective Completion',
                value: '$objectiveCompletion%',
              ),
              _Metric(label: 'KPI Health', value: '$kpiHealth%'),
              _Metric(label: 'Risk Exposure', value: '$riskExposure'),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Strategic Governance Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _Capability(name: 'Autonomous Strategy Engine'),
          const _Capability(name: 'Portfolio Governance Engine'),
          const _Capability(name: 'Strategic Risk Intelligence'),
          const _Capability(name: 'Executive Governance Center'),
          const _Capability(name: 'Strategy Simulation Engine'),
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
      width: 220,
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
