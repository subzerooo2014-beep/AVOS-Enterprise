import 'package:flutter/material.dart';

class SuperAppV6RuntimePage extends StatelessWidget {
  const SuperAppV6RuntimePage({super.key});

  static const _steps = <Map<String, Object>>[
    {
      'title': 'إنشاء الصفقة',
      'subtitle': 'إنشاء صفقة موحدة وربط المشتري والبائع والمركبة.',
      'icon': Icons.handshake_outlined,
    },
    {
      'title': 'بدء التكاملات',
      'subtitle': 'تشغيل التمويل والتأمين والفحص والدفع والشحن حسب الحاجة.',
      'icon': Icons.hub_outlined,
    },
    {
      'title': 'طابور التنفيذ',
      'subtitle': 'إرسال مهام التكاملات إلى طابور موثوق مع منع التكرار.',
      'icon': Icons.queue_outlined,
    },
    {
      'title': 'المعالجة',
      'subtitle': 'تنفيذ المهام وتتبع المحاولات والنتائج.',
      'icon': Icons.settings_suggest_outlined,
    },
    {
      'title': 'الإشعارات والتدقيق',
      'subtitle': 'إشعار المستخدم وتسجيل كل خطوة بواسطة Correlation ID.',
      'icon': Icons.notifications_active_outlined,
    },
    {
      'title': 'إتمام الدورة',
      'subtitle': 'عرض النتيجة النهائية لجميع مكونات الصفقة.',
      'icon': Icons.task_alt_outlined,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('AVOS Super App — Phase 6'),
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
                      'Unified Deal Runtime',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.w900,
                          ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'دورة موحدة تربط الصفقة والتكاملات والطوابير والإشعارات والتدقيق.',
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            for (final step in _steps)
              Card(
                child: ListTile(
                  leading: CircleAvatar(
                    child: Icon(step['icon']! as IconData),
                  ),
                  title: Text(
                    step['title']! as String,
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                  subtitle: Text(step['subtitle']! as String),
                  trailing: const Icon(Icons.chevron_left),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
