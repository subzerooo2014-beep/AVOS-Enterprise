import 'package:flutter/material.dart';
class RuntimeCompatibilityPage extends StatelessWidget {
  const RuntimeCompatibilityPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('توافق Runtime')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS Universal Platform Fabric.'),
            ),
          ),
        ),
      ),
    );
  }
}
