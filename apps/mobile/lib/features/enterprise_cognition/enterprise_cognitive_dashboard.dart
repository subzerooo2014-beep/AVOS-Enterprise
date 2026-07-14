import 'package:flutter/material.dart';

class CognitiveMetric {
  const CognitiveMetric({
    required this.label,
    required this.value,
  });

  final String label;
  final int value;
}

class EnterpriseCognitiveDashboard extends StatelessWidget {
  const EnterpriseCognitiveDashboard({
    super.key,
    this.metrics = const [
      CognitiveMetric(label: 'Cognition Score', value: 82),
      CognitiveMetric(label: 'Reasoning Confidence', value: 79),
      CognitiveMetric(label: 'Organizational Readiness', value: 76),
    ],
  });

  final List<CognitiveMetric> metrics;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Enterprise Cognition')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              for (final metric in metrics)
                SizedBox(
                  width: 220,
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(metric.label),
                          const SizedBox(height: 8),
                          Text(
                            '${metric.value}%',
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Autonomous Intelligence Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _CapabilityTile(name: 'Enterprise Cognitive Engine'),
          const _CapabilityTile(name: 'Autonomous Reasoning Engine'),
          const _CapabilityTile(name: 'Multi-Agent Decision Intelligence'),
          const _CapabilityTile(name: 'Strategic Planning Intelligence'),
          const _CapabilityTile(name: 'Executive Decision Support'),
        ],
      ),
    );
  }
}

class _CapabilityTile extends StatelessWidget {
  const _CapabilityTile({required this.name});

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
