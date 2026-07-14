import 'package:flutter/material.dart';
class LifecycleSettingsPage extends StatelessWidget {
  const LifecycleSettingsPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('إعدادات دورة الحياة')),
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
