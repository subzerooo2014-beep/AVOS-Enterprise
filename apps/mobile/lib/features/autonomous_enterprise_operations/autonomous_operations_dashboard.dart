import 'package:flutter/material.dart';

class AutonomousOperationsDashboard extends StatelessWidget {
  const AutonomousOperationsDashboard({
    super.key,
    this.readinessScore = 84,
    this.activeMissions = 4,
    this.blockedMissions = 1,
    this.availableCapacity = 72,
  });

  final int readinessScore;
  final int activeMissions;
  final int blockedMissions;
  final int availableCapacity;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Autonomous Operations')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(label: 'Readiness Score', value: '$readinessScore%'),
              _Metric(label: 'Active Missions', value: '$activeMissions'),
              _Metric(label: 'Blocked Missions', value: '$blockedMissions'),
              _Metric(
                label: 'Available Capacity',
                value: '$availableCapacity%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Autonomous Execution Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _Capability(name: 'Mission Planning Engine'),
          const _Capability(name: 'Adaptive Resource Allocation'),
          const _Capability(name: 'Workflow Recovery'),
          const _Capability(name: 'Operational Control'),
          const _Capability(name: 'Enterprise Command Center'),
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
