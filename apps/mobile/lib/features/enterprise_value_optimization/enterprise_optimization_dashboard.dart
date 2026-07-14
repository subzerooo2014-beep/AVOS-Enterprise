import 'package:flutter/material.dart';

class EnterpriseOptimizationDashboard extends StatelessWidget {
  const EnterpriseOptimizationDashboard({
    super.key,
    this.enterpriseValueScore = 84,
    this.performanceScore = 81,
    this.costEfficiency = 76,
    this.profitabilityScore = 79,
    this.roiScore = 82,
  });

  final int enterpriseValueScore;
  final int performanceScore;
  final int costEfficiency;
  final int profitabilityScore;
  final int roiScore;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Enterprise Optimization')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Enterprise Value',
                value: '$enterpriseValueScore%',
              ),
              _Metric(
                label: 'Performance Score',
                value: '$performanceScore%',
              ),
              _Metric(
                label: 'Cost Efficiency',
                value: '$costEfficiency%',
              ),
              _Metric(
                label: 'Profitability',
                value: '$profitabilityScore%',
              ),
              _Metric(label: 'ROI Score', value: '$roiScore%'),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Value Optimization Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _Capability(name: 'Enterprise Value Intelligence'),
          const _Capability(name: 'Continuous Optimization Engine'),
          const _Capability(name: 'Bottleneck Analyzer'),
          const _Capability(name: 'Revenue Intelligence'),
          const _Capability(name: 'Value Forecast Engine'),
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
