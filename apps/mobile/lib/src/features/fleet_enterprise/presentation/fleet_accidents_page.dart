import 'package:flutter/material.dart';

class FleetAccidentsPage extends StatelessWidget {
  const FleetAccidentsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('الحوادث')),
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
