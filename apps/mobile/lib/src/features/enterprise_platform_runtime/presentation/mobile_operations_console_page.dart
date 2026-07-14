import 'package:flutter/material.dart';
class MobileOperationsConsolePage extends StatelessWidget {
 const MobileOperationsConsolePage({super.key});
 @override
 Widget build(BuildContext context){
  return Directionality(
   textDirection: TextDirection.rtl,
   child: Scaffold(
    appBar: AppBar(title: const Text('وحدة العمليات المحمولة')),
    body: const Padding(
     padding: EdgeInsets.all(18),
     child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Enterprise Platform Runtime & Operations.'))),
    ),
   ),
  );
 }
}
