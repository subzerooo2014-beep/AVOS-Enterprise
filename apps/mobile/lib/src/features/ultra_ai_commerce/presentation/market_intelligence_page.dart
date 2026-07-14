import 'package:flutter/material.dart';

class MarketIntelligencePage extends StatelessWidget {
  const MarketIntelligencePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('ذكاء السوق')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: const [
            Card(
              child: Padding(
                padding: EdgeInsets.all(18),
                child: Text(
                  'تحليل الأسعار والطلب والاتجاه.',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
