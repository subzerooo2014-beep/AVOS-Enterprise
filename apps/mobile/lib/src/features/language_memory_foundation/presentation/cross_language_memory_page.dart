import 'package:flutter/material.dart';

class CrossLanguageMemoryPage extends StatelessWidget {
  const CrossLanguageMemoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('الذاكرة العابرة للغات')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS Language & Memory Foundation.'),
            ),
          ),
        ),
      ),
    );
  }
}
