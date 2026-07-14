import 'package:flutter/material.dart';
class VehicleInspectionPage extends StatelessWidget {
  const VehicleInspectionPage({super.key});
  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('الفحص')),
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
