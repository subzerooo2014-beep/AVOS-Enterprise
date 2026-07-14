import 'package:flutter/material.dart';

class ZeroTrustSecurityDashboard extends StatelessWidget {
  const ZeroTrustSecurityDashboard({
    super.key,
    this.zeroTrustScore = 91,
    this.identityAssurance = 89,
    this.deviceTrust = 86,
    this.securityPosture = 88,
    this.activeIncidents = 1,
    this.privilegedRisk = 14,
  });

  final int zeroTrustScore;
  final int identityAssurance;
  final int deviceTrust;
  final int securityPosture;
  final int activeIncidents;
  final int privilegedRisk;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Zero Trust Security')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _Metric(
                label: 'Zero Trust Score',
                value: '$zeroTrustScore%',
              ),
              _Metric(
                label: 'Identity Assurance',
                value: '$identityAssurance%',
              ),
              _Metric(
                label: 'Device Trust',
                value: '$deviceTrust%',
              ),
              _Metric(
                label: 'Security Posture',
                value: '$securityPosture%',
              ),
              _Metric(
                label: 'Active Incidents',
                value: '$activeIncidents',
              ),
              _Metric(
                label: 'Privileged Risk',
                value: '$privilegedRisk',
              ),
            ],
          ),
          const SizedBox(height: 20),
          Text(
            'Zero Trust Capabilities',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          const _Capability(name: 'Continuous Identity Verification'),
          const _Capability(name: 'Device Trust Intelligence'),
          const _Capability(name: 'Behavioral Threat Detection'),
          const _Capability(name: 'Autonomous Incident Response'),
          const _Capability(name: 'Security Command Center'),
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
