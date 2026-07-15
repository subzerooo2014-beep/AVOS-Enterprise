import 'package:flutter/material.dart';

class FinanceCommerceDashboard extends StatelessWidget {
  const FinanceCommerceDashboard({
    super.key,
    this.capturedPayments = 42,
    this.activeDeposits = 11,
    this.approvedFinancing = 8,
    this.issuedContracts = 15,
    this.averageRiskScore = 18,
  });

  final int capturedPayments;
  final int activeDeposits;
  final int approvedFinancing;
  final int issuedContracts;
  final int averageRiskScore;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Finance & Commerce'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Captured Payments',
                value: '$capturedPayments',
              ),
              _Metric(
                label: 'Active Deposits',
                value: '$activeDeposits',
              ),
              _Metric(
                label: 'Approved Financing',
                value: '$approvedFinancing',
              ),
              _Metric(
                label: 'Issued Contracts',
                value: '$issuedContracts',
              ),
              _Metric(
                label: 'Average Risk',
                value: '$averageRiskScore%',
              ),
            ],
          ),
          const SizedBox(height: 20),
          const _Capability(name: 'Payment Orchestration'),
          const _Capability(name: 'Vehicle Deposits'),
          const _Capability(name: 'Financing Applications'),
          const _Capability(name: 'Insurance Quotations'),
          const _Capability(name: 'Digital Contracts'),
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
