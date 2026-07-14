import 'package:flutter/material.dart';

class DataKnowledgeDashboard extends StatelessWidget {
  const DataKnowledgeDashboard({
    super.key,
    this.governanceScore = 88,
    this.dataQualityScore = 85,
    this.metadataCoverage = 82,
    this.lineageCoverage = 79,
    this.knowledgeGraphHealth = 87,
    this.memoryVaultHealth = 91,
  });

  final int governanceScore;
  final int dataQualityScore;
  final int metadataCoverage;
  final int lineageCoverage;
  final int knowledgeGraphHealth;
  final int memoryVaultHealth;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Data & Knowledge Fabric')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Governance Score',
                value: '$governanceScore%',
              ),
              _Metric(
                label: 'Data Quality',
                value: '$dataQualityScore%',
              ),
              _Metric(
                label: 'Metadata Coverage',
                value: '$metadataCoverage%',
              ),
              _Metric(
                label: 'Lineage Coverage',
                value: '$lineageCoverage%',
              ),
              _Metric(
                label: 'Knowledge Graph',
                value: '$knowledgeGraphHealth%',
              ),
              _Metric(
                label: 'Memory Vault',
                value: '$memoryVaultHealth%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Data & Knowledge Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _Capability(name: 'Data Governance Engine'),
          const _Capability(name: 'Metadata Catalog Intelligence'),
          const _Capability(name: 'Knowledge Fabric Engine'),
          const _Capability(name: 'Enterprise Memory Vault'),
          const _Capability(name: 'Data Sovereignty Intelligence'),
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
