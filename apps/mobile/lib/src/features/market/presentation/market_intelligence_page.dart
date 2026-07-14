import 'package:flutter/material.dart';
import '../../../../design_system/avos_colors.dart';
import '../../../../design_system/luxury_card.dart';

class MarketIntelligencePage extends StatelessWidget {
  const MarketIntelligencePage({super.key});

  @override
  Widget build(BuildContext context) {
    final metrics = [
      ('اتجاه السوق', 'صعود معتدل', '+3.8%'),
      ('الطلب على SUV', 'قوي', '87%'),
      ('فرص أقل من السوق', 'متاحة', '14'),
      ('مؤشر الثقة', 'مرتفع', '92%'),
    ];

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('ذكاء السوق')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            const LuxuryCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'ملخص السوق اليوم',
                    style: TextStyle(
                      color: AvosColors.emerald,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'الطلب مرتفع على المركبات العائلية وSUV الموثوقة.',
                    style: TextStyle(
                      fontSize: 21,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: metrics.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.25,
              ),
              itemBuilder: (context, index) {
                final metric = metrics[index];
                return LuxuryCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        metric.$1,
                        style: const TextStyle(color: AvosColors.muted),
                      ),
                      const Spacer(),
                      Text(
                        metric.$2,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      Text(
                        metric.$3,
                        style: const TextStyle(
                          color: AvosColors.emerald,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}