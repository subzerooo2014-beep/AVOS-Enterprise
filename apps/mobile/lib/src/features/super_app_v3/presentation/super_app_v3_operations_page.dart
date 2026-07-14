import 'package:flutter/material.dart';

class SuperAppV3OperationsPage extends StatelessWidget {
  const SuperAppV3OperationsPage({super.key});

  static const _operations = <({String title, String subtitle, IconData icon})>[
    (
      title: 'المطابقة الذكية',
      subtitle: 'مطابقة المشترين بالمركبات حسب الميزانية والتفضيلات والثقة.',
      icon: Icons.auto_awesome,
    ),
    (
      title: 'التفاوض الذكي',
      subtitle: 'إدارة العروض والردود والاتفاق النهائي بمساعدة عزم.',
      icon: Icons.handshake_outlined,
    ),
    (
      title: 'الحجز والفحص',
      subtitle: 'متابعة الحجز وفحص المركبة وتوثيق النتيجة.',
      icon: Icons.fact_check_outlined,
    ),
    (
      title: 'التمويل والتأمين',
      subtitle: 'متابعة طلبات التمويل والتأمين من مسار واحد.',
      icon: Icons.account_balance_outlined,
    ),
    (
      title: 'الدفع وإتمام الصفقة',
      subtitle: 'إدارة حالة الدفع وإغلاق الصفقة بأمان.',
      icon: Icons.payments_outlined,
    ),
    (
      title: 'الخط الزمني للصفقة',
      subtitle: 'عرض كل خطوة وقرار وتحديث منذ المطابقة حتى الإكمال.',
      icon: Icons.timeline_outlined,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('AVOS Super App — Phase 3'),
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
                      'مركز الصفقات الذكي',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w900,
                          ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'إدارة دورة الصفقة من المطابقة والتفاوض إلى الدفع والإكمال.',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            for (final operation in _operations)
              Card(
                child: ListTile(
                  leading: CircleAvatar(child: Icon(operation.icon)),
                  title: Text(
                    operation.title,
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                  subtitle: Text(operation.subtitle),
                  trailing: const Icon(Icons.chevron_left),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
