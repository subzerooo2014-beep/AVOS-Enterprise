import 'package:flutter/material.dart';

class AiOperationsDashboard extends StatelessWidget {
  const AiOperationsDashboard({
    super.key,
    this.activeWorkflows = 34,
    this.queuedTasks = 18,
    this.activeAgents = 12,
    this.automationRate = 82,
    this.slaCompliance = 96,
    this.decisionExecutionRate = 88,
  });

  final int activeWorkflows;
  final int queuedTasks;
  final int activeAgents;
  final int automationRate;
  final int slaCompliance;
  final int decisionExecutionRate;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Operations Center'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(label: 'Active Workflows', value: '$activeWorkflows'),
              _Metric(label: 'Queued Tasks', value: '$queuedTasks'),
              _Metric(label: 'Active Agents', value: '$activeAgents'),
              _Metric(label: 'Automation Rate', value: '$automationRate%'),
              _Metric(label: 'SLA Compliance', value: '$slaCompliance%'),
              _Metric(
                label: 'Decision Execution',
                value: '$decisionExecutionRate%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Autonomous Workflows'),
          const _Capability(name: 'Enterprise Automation'),
          const _Capability(name: 'Multi-Agent Operations'),
          const _Capability(name: 'Predictive Operations'),
          const _Capability(name: 'Decision Intelligence'),
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
