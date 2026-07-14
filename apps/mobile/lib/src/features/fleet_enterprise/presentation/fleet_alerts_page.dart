import 'package:flutter/material.dart';

class FleetAlertsPage extends StatelessWidget {
  const FleetAlertsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('التنبيهات')),
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
