import 'package:flutter/material.dart';

class PartnerPlatformPage extends StatelessWidget {
  const PartnerPlatformPage({super.key});

  static const _items = <Map<String, Object>>[
    {'title': 'التمويل', 'icon': Icons.account_balance_outlined},
    {'title': 'التأمين', 'icon': Icons.shield_outlined},
    {'title': 'الفحص', 'icon': Icons.fact_check_outlined},
    {'title': 'الدفع', 'icon': Icons.payments_outlined},
    {'title': 'الشحن والتصدير', 'icon': Icons.local_shipping_outlined},
    {'title': 'Sandbox / Production', 'icon': Icons.swap_horiz_outlined},
  ];

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('AVOS Partner Platform')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            const Card(
              child: Padding(
                padding: EdgeInsets.all(18),
                child: Text(
                  'Mega Bundle A — منصة ربط الشركاء',
                  style: TextStyle(fontWeight: FontWeight.w900, fontSize: 20),
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
                  trailing: const Icon(Icons.chevron_left),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
