import 'package:flutter/material.dart';

class AuctionModerationPage extends StatelessWidget {
  const AuctionModerationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('إدارة المزاد')),
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
