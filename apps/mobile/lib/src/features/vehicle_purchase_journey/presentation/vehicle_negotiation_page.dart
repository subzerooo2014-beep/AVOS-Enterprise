import 'package:flutter/material.dart';
class VehicleNegotiationPage extends StatelessWidget {
  const VehicleNegotiationPage({super.key});
  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('التفاوض')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن رحلة شراء المركبة الكاملة.'),
            ),
          ),
        ),
      ),
    );
  }
}
