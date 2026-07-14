import 'package:flutter/material.dart';

class DynamicPricingPage extends StatelessWidget {
  const DynamicPricingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('التسعير الذكي')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: const [
            Card(
              child: Padding(
                padding: EdgeInsets.all(18),
                child: Text(
                  'تحليل السعر المقترح والحد الأدنى والأقصى.',
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
