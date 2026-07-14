import 'package:flutter/material.dart';

class SellerPerformancePage extends StatelessWidget {
  const SellerPerformancePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('أداء البائع')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن رحلة بيع المركبة الكاملة.'),
            ),
          ),
        ),
      ),
    );
  }
}
