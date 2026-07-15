import 'package:flutter/material.dart';

class CrmGrowthDashboard extends StatelessWidget {
  const CrmGrowthDashboard({
    super.key,
    this.activeCustomers = 1240,
    this.healthyCustomers = 982,
    this.qualifiedLeads = 146,
    this.pipelineValue = 4200000,
    this.churnRisk = 18,
    this.nps = 61,
  });

  final int activeCustomers;
  final int healthyCustomers;
  final int qualifiedLeads;
  final double pipelineValue;
  final int churnRisk;
  final int nps;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CRM & Growth Intelligence'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(label: 'Active Customers', value: '$activeCustomers'),
              _Metric(label: 'Healthy Customers', value: '$healthyCustomers'),
              _Metric(label: 'Qualified Leads', value: '$qualifiedLeads'),
              _Metric(
                label: 'Pipeline Value',
                value: pipelineValue.toStringAsFixed(0),
              ),
              _Metric(label: 'Churn Risk', value: '$churnRisk%'),
              _Metric(label: 'NPS', value: '$nps'),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Customer 360'),
          const _Capability(name: 'Customer Success'),
          const _Capability(name: 'Sales Pipeline'),
          const _Capability(name: 'Retention & Churn AI'),
          const _Capability(name: 'Growth Intelligence'),
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
