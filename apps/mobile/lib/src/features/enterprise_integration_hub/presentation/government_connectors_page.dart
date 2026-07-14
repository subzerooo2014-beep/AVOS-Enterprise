import 'package:flutter/material.dart';
class GovernmentConnectorsPage extends StatelessWidget {
  const GovernmentConnectorsPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('الموصلات الحكومية')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS Enterprise Integration Hub.'),
            ),
          ),
        ),
      ),
    );
  }
}
