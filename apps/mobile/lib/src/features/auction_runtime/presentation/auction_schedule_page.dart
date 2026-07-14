import 'package:flutter/material.dart';

class AuctionSchedulePage extends StatelessWidget {
  const AuctionSchedulePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('جدولة المزاد')),
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
