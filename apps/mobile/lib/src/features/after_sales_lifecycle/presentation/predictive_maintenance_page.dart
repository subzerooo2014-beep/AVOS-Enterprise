import 'package:flutter/material.dart';
class PredictiveMaintenancePage extends StatelessWidget {
  const PredictiveMaintenancePage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('الصيانة التنبؤية')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS After-Sales & Vehicle Lifecycle OS.'),
            ),
          ),
        ),
      ),
    );
  }
}
