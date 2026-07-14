import 'package:flutter/material.dart';

class AiMemoryPage extends StatelessWidget {
  const AiMemoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('الذاكرة')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text(
                'واجهة تشغيلية ضمن منصة AVOS Enterprise AI OS.',
              ),
            ),
          ),
        ),
      ),
    );
  }
}
