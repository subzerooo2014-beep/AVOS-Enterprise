import 'package:flutter/material.dart';

class AiAgentOsV2Dashboard extends StatelessWidget {
  const AiAgentOsV2Dashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Agent OS V2')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _Metric(label: 'Capabilities', value: '100'),
          _Metric(label: 'Security', value: '100%'),
          _Metric(label: 'Reasoning', value: '100%'),
          _Metric(label: 'Collaboration', value: '100%'),
          _Capability(name: 'Agent Runtime'),
          _Capability(name: 'Agent Marketplace'),
          _Capability(name: 'Memory Graph'),
          _Capability(name: 'Multi-Agent Collaboration'),
          _Capability(name: 'Enterprise Agent Security'),
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
    return Card(
      child: ListTile(title: Text(label), trailing: Text(value)),
    );
  }
}

class _Capability extends StatelessWidget {
  const _Capability({required this.name});
  final String name;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(title: Text(name), trailing: const Text('Operational')),
    );
  }
}
