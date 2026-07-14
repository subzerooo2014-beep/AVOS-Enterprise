import 'package:flutter/material.dart';
class DataLakePage extends StatelessWidget {
  const DataLakePage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('بحيرة البيانات')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Data Platform, Analytics & Intelligence OS.'))),
        ),
      ),
    );
  }
}
