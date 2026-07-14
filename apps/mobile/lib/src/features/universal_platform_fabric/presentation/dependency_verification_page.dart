import 'package:flutter/material.dart';
class DependencyVerificationPage extends StatelessWidget {
  const DependencyVerificationPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('التحقق من الاعتماديات')),
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
