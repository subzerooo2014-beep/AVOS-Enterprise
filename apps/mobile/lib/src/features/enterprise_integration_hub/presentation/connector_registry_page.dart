import 'package:flutter/material.dart';
class ConnectorRegistryPage extends StatelessWidget {
  const ConnectorRegistryPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('سجل الموصلات')),
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
