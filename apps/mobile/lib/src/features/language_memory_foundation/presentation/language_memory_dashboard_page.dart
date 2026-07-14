import 'package:flutter/material.dart';

class LanguageMemoryDashboardPage extends StatelessWidget {
  const LanguageMemoryDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('لوحة اللغة والذاكرة')),
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
