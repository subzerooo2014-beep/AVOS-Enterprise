import 'package:flutter/material.dart';
import '../../../../design_system/luxury_card.dart';

class VehicleVisionPage extends StatefulWidget {
  const VehicleVisionPage({super.key});

  @override
  State<VehicleVisionPage> createState() => _VehicleVisionPageState();
}

class _VehicleVisionPageState extends State<VehicleVisionPage> {
  bool _analyzed = false;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('تحليل صورة المركبة')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            LuxuryCard(
              child: Column(
                children: [
                  Container(
                    height: 220,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F0ED),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: const Center(
                      child: Icon(Icons.add_a_photo_outlined, size: 72),
                    ),
                  ),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    onPressed: () => setState(() => _analyzed = true),
                    icon: const Icon(Icons.image_search),
                    label: const Text('اختيار صورة وتحليلها'),
                  ),
                ],
              ),
            ),
            if (_analyzed) ...[
              const SizedBox(height: 16),
              const LuxuryCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'نتيجة التحليل الأولي',
                      style: TextStyle(fontWeight: FontWeight.w900),
                    ),
                    SizedBox(height: 10),
                    Text('النوع المتوقع: SUV'),
                    Text('الحالة الظاهرة: جيدة'),
                    Text('الثقة: 91%'),
                    Text('نطاق السعر: AED 180,000 – 220,000'),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}