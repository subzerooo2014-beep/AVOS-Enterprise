import 'package:flutter/material.dart';
import '../../../../design_system/avos_colors.dart';
import '../../../../design_system/luxury_card.dart';

class RecommendationsPage extends StatelessWidget {
  const RecommendationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final recommendations = [
      ('Toyota Land Cruiser 2024', 'أفضل ثقة', '96%'),
      ('Nissan Patrol 2023', 'أفضل قيمة', '93%'),
      ('Tesla Model Y 2024', 'أقل تكلفة تشغيل', '94%'),
    ];

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('التوصيات الذكية')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            const LuxuryCard(
              child: Text(
                'اختيارات عزم بناءً على السعر، الثقة، الاستخدام وتكلفة الملكية.',
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            const SizedBox(height: 16),
            ...recommendations.map(
              (item) => Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFDDF6EF),
                    child: Icon(
                      Icons.directions_car,
                      color: AvosColors.emerald,
                    ),
                  ),
                  title: Text(
                    item.$1,
                    style: const TextStyle(fontWeight: FontWeight.w900),
                  ),
                  subtitle: Text(item.$2),
                  trailing: Text(
                    item.$3,
                    style: const TextStyle(
                      color: AvosColors.emerald,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}