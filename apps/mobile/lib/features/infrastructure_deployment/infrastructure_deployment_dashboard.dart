import 'package:flutter/material.dart';

class InfrastructureDeploymentDashboard extends StatelessWidget {
  const InfrastructureDeploymentDashboard({
    super.key,
    this.containerScore = 100,
    this.kubernetesScore = 100,
    this.cicdScore = 100,
    this.dependencyScore = 100,
    this.securityEdgeScore = 100,
    this.observabilityScore = 100,
    this.deploymentScore = 100,
  });

  final int containerScore;
  final int kubernetesScore;
  final int cicdScore;
  final int dependencyScore;
  final int securityEdgeScore;
  final int observabilityScore;
  final int deploymentScore;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Infrastructure & Deployment'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(label: 'Containers', value: '$containerScore%'),
              _Metric(label: 'Kubernetes', value: '$kubernetesScore%'),
              _Metric(label: 'CI/CD', value: '$cicdScore%'),
              _Metric(label: 'Dependencies', value: '$dependencyScore%'),
              _Metric(label: 'Security Edge', value: '$securityEdgeScore%'),
              _Metric(label: 'Observability', value: '$observabilityScore%'),
              _Metric(label: 'Deployment', value: '$deploymentScore%'),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Container Platform'),
          const _Capability(name: 'Kubernetes & Auto Scaling'),
          const _Capability(name: 'CI/CD Pipeline'),
          const _Capability(name: 'Monitoring & Logging'),
          const _Capability(name: 'Deployment Strategies'),
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
