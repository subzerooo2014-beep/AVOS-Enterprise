import 'package:flutter/material.dart';

class SuperAppV5OperationsPage extends StatelessWidget {
  const SuperAppV5OperationsPage({super.key});

  static const _items = <Map<String, Object>>[
    {
      'title': 'سجل الشركاء والاعتمادات',
      'subtitle': 'إدارة المفاتيح، التفعيل، التعطيل وتدوير بيانات الاعتماد.',
      'icon': Icons.vpn_key_outlined,
    },
    {
      'title': 'طابور المهام',
      'subtitle': 'متابعة المهام المعلقة والجارية والمكتملة.',
      'icon': Icons.queue_outlined,
    },
    {
      'title': 'إعادة المحاولة',
      'subtitle': 'معالجة حالات الفشل وإعادة المحاولة التدريجية.',
      'icon': Icons.refresh_outlined,
    },
    {
      'title': 'Dead Letter Queue',
      'subtitle': 'مراجعة المهام التي تجاوزت الحد الأقصى للمحاولات.',
      'icon': Icons.error_outline,
    },
    {
      'title': 'الحماية من التكرار',
      'subtitle': 'منع تنفيذ الطلب نفسه أكثر من مرة باستخدام Idempotency.',
      'icon': Icons.copy_all_outlined,
    },
    {
      'title': 'سجل التدقيق والتنبيهات',
      'subtitle': 'تتبع الأحداث، Correlation ID، والإشعارات التشغيلية.',
      'icon': Icons.receipt_long_outlined,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('AVOS Super App — Phase 5'),
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
                      'مركز موثوقية التكاملات',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w900,
                          ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'مراقبة الطوابير، إعادة المحاولة، الاعتمادات، السجلات والتنبيهات.',
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
