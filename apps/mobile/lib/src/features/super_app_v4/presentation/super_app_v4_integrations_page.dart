import 'package:flutter/material.dart';

class SuperAppV4IntegrationsPage extends StatelessWidget {
  const SuperAppV4IntegrationsPage({super.key});

  static const _items = <Map<String, Object>>[
    {
      'title': 'التمويل',
      'subtitle': 'طلبات التمويل، الموافقات وحالة المعالجة.',
      'icon': Icons.account_balance_outlined,
    },
    {
      'title': 'التأمين',
      'subtitle': 'عروض التأمين، الموافقات وربط الوثائق.',
      'icon': Icons.shield_outlined,
    },
    {
      'title': 'الفحص',
      'subtitle': 'حجز الفحص، النتائج واعتماد تقرير المركبة.',
      'icon': Icons.fact_check_outlined,
    },
    {
      'title': 'الدفع',
      'subtitle': 'متابعة الدفع، الفشل، إعادة المحاولة والإكمال.',
      'icon': Icons.payments_outlined,
    },
    {
      'title': 'الشحن والتصدير',
      'subtitle': 'طلبات الشحن، التصدير والتحديثات الخارجية.',
      'icon': Icons.local_shipping_outlined,
    },
    {
      'title': 'Webhooks والشركاء',
      'subtitle': 'متابعة إشعارات الشركاء وحالة التكاملات.',
      'icon': Icons.hub_outlined,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('AVOS Super App — Phase 4'),
        ),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'مركز التكاملات التشغيلية',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w900,
                          ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'إدارة وربط التمويل والتأمين والفحص والدفع والشحن والتصدير.',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            for (final item in _items)
              Card(
                child: ListTile(
                  leading: CircleAvatar(
                    child: Icon(item['icon']! as IconData),
                  ),
                  title: Text(
                    item['title']! as String,
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                  subtitle: Text(item['subtitle']! as String),
                  trailing: const Icon(Icons.chevron_left),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
