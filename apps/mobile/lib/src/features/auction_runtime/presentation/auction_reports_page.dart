import 'package:flutter/material.dart';

class AuctionReportsPage extends StatelessWidget {
  const AuctionReportsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('تقارير المزاد')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن نظام المزادات الكامل.'),
            ),
          ),
        ),
      ),
    );
  }
}
