class AvosApplicationDefinition {
  final String key;
  final String name;
  final List<String> capabilities;

  const AvosApplicationDefinition({
    required this.key,
    required this.name,
    required this.capabilities,
  });
}

class ApplicationsSuiteRegistry {
  static const applications = <AvosApplicationDefinition>[
    AvosApplicationDefinition(
      key: 'customer-app',
      name: 'Customer App',
      capabilities: ['marketplace', 'offers', 'bookings', 'messages'],
    ),
    AvosApplicationDefinition(
      key: 'dealer-app',
      name: 'Dealer App',
      capabilities: ['inventory', 'leads', 'quotes', 'sales'],
    ),
    AvosApplicationDefinition(
      key: 'workshop-app',
      name: 'Workshop App',
      capabilities: ['bookings', 'jobs', 'parts', 'warranty'],
    ),
    AvosApplicationDefinition(
      key: 'finance-partner-app',
      name: 'Finance Partner App',
      capabilities: ['applications', 'approvals', 'offers', 'settlements'],
    ),
    AvosApplicationDefinition(
      key: 'insurance-partner-app',
      name: 'Insurance Partner App',
      capabilities: ['quotes', 'policies', 'claims', 'renewals'],
    ),
    AvosApplicationDefinition(
      key: 'logistics-app',
      name: 'Logistics App',
      capabilities: ['shipments', 'tracking', 'customs', 'delivery'],
    ),
    AvosApplicationDefinition(
      key: 'admin-console',
      name: 'Admin Console',
      capabilities: ['users', 'moderation', 'governance', 'operations'],
    ),
    AvosApplicationDefinition(
      key: 'executive-dashboard',
      name: 'Executive Dashboard',
      capabilities: ['kpis', 'revenue', 'growth', 'risk'],
    )
  ];

  static AvosApplicationDefinition byKey(String key) {
    return applications.firstWhere(
      (application) => application.key == key,
      orElse: () => throw ArgumentError('Unknown AVOS application: $key'),
    );
  }
}