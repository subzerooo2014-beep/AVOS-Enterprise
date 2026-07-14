import 'package:flutter/material.dart';

class EnterpriseCognitiveCoreDashboard extends StatelessWidget {
  const EnterpriseCognitiveCoreDashboard({
    super.key,
    this.cognitionScore = 89,
    this.reasoningConfidence = 86,
    this.knowledgeCoverage = 84,
    this.memoryHealth = 88,
    this.learningVelocity = 72,
    this.activeGoals = 7,
  });

  final int cognitionScore;
  final int reasoningConfidence;
  final int knowledgeCoverage;
  final int memoryHealth;
  final int learningVelocity;
  final int activeGoals;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Enterprise Cognitive Core')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Cognition Score',
                value: '$cognitionScore%',
              ),
              _Metric(
                label: 'Reasoning Confidence',
                value: '$reasoningConfidence%',
              ),
              _Metric(
                label: 'Knowledge Coverage',
                value: '$knowledgeCoverage%',
              ),
              _Metric(
                label: 'Memory Health',
                value: '$memoryHealth%',
              ),
              _Metric(
                label: 'Learning Velocity',
                value: '$learningVelocity%',
              ),
              _Metric(
                label: 'Active Goals',
                value: '$activeGoals',
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Cognitive Core Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _Capability(name: 'Autonomous Reasoning Engine'),
          const _Capability(name: 'Knowledge Synthesis Engine'),
          const _Capability(name: 'Enterprise Memory Graph V2'),
          const _Capability(name: 'Enterprise Learning Engine'),
          const _Capability(name: 'Decision Explainability Engine'),
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
