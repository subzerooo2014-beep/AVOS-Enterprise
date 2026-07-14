import 'package:flutter/material.dart';

class CreateAuctionPage extends StatelessWidget {
  const CreateAuctionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('إنشاء مزاد')),
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
