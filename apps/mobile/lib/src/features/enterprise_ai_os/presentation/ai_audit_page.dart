import 'package:flutter/material.dart';

class AiAuditPage extends StatelessWidget {
  const AiAuditPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('تدقيق الذكاء')),
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
