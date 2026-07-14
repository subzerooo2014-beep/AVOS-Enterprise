import 'package:flutter/material.dart';

class FleetFuelPage extends StatelessWidget {
  const FleetFuelPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('الوقود')),
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
