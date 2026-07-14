import 'package:flutter/material.dart';
class CrmConnectorsPage extends StatelessWidget {
  const CrmConnectorsPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('موصلات CRM')),
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
