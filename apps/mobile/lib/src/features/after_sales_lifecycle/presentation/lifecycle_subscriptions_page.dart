import 'package:flutter/material.dart';
class LifecycleSubscriptionsPage extends StatelessWidget {
  const LifecycleSubscriptionsPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('الاشتراكات')),
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
