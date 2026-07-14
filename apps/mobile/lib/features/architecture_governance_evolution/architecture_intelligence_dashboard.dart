import 'package:flutter/material.dart';

class ArchitectureCapabilityStatus {
  const ArchitectureCapabilityStatus({
    required this.name,
    required this.status,
    required this.score,
  });

  final String name;
  final String status;
  final double score;
}

class ArchitectureIntelligenceDashboard extends StatelessWidget {
  const ArchitectureIntelligenceDashboard({
    super.key,
    this.architectureFitness = 70,
    this.governanceMaturity = 70,
    this.technicalDebtScore = 100,
    this.capabilities = const [
      ArchitectureCapabilityStatus(
        name: 'AI Architecture Genome',
        status: 'Operational',
        score: 0.82,
      ),
      ArchitectureCapabilityStatus(
        name: 'Adaptive Architecture Kernel',
        status: 'Operational',
        score: 0.80,
      ),
      ArchitectureCapabilityStatus(
        name: 'Architecture Synthesis Engine',
        status: 'Operational',
        score: 0.78,
      ),
      ArchitectureCapabilityStatus(
        name: 'Self-Designing Architecture',
        status: 'Operational',
        score: 0.76,
      ),
      ArchitectureCapabilityStatus(
        name: 'Governance Evolution',
        status: 'Operational',
        score: 0.84,
      ),
    ],
  });

  final int architectureFitness;
  final int governanceMaturity;
  final int technicalDebtScore;
  final List<ArchitectureCapabilityStatus> capabilities;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Architecture Intelligence')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _MetricCard(
                label: 'Architecture Fitness',
                value: '$architectureFitness%',
              ),
              _MetricCard(
                label: 'Governance Maturity',
                value: '$governanceMaturity%',
              ),
              _MetricCard(
                label: 'Technical Debt Score',
                value: '$technicalDebtScore%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Evolution Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          for (final capability in capabilities)
            Card(
              child: ListTile(
                title: Text(capability.name),
                subtitle: LinearProgressIndicator(value: capability.score),
                trailing: Text(capability.status),
              ),
            ),
        ],
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({required this.label, required this.value});

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
