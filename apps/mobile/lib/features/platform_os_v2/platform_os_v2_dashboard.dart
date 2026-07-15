import 'package:flutter/material.dart';

class PlatformOsV2Dashboard extends StatelessWidget {
  const PlatformOsV2Dashboard({
    super.key,
    this.registeredCapabilities = 82,
    this.activeModules = 32,
    this.activePlugins = 18,
    this.activeExtensions = 21,
    this.automationRate = 100,
    this.governanceScore = 100,
    this.platformScore = 100,
  });

  final int registeredCapabilities;
  final int activeModules;
  final int activePlugins;
  final int activeExtensions;
  final int automationRate;
  final int governanceScore;
  final int platformScore;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AVOS Platform OS V2')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Capabilities',
                value: '$registeredCapabilities',
              ),
              _Metric(label: 'Modules', value: '$activeModules'),
              _Metric(label: 'Plugins', value: '$activePlugins'),
              _Metric(label: 'Extensions', value: '$activeExtensions'),
              _Metric(
                label: 'Automation',
                value: '$automationRate%',
              ),
              _Metric(
                label: 'Governance',
                value: '$governanceScore%',
              ),
              _Metric(
                label: 'Platform Score',
                value: '$platformScore%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Core Runtime'),
          const _Capability(name: 'Plugin Platform'),
          const _Capability(name: 'Capability Registry V2'),
          const _Capability(name: 'Enterprise App Store'),
          const _Capability(name: 'Platform Automation'),
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
