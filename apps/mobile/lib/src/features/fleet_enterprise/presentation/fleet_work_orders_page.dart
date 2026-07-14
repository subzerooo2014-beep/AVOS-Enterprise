import 'package:flutter/material.dart';

class FleetWorkOrdersPage extends StatelessWidget {
  const FleetWorkOrdersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('أوامر العمل')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن منصة إدارة الأساطيل والمؤسسات.'),
            ),
          ),
        ),
      ),
    );
  }
}
