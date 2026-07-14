import 'package:flutter/material.dart';
class ReferralEnginePage extends StatelessWidget {
 const ReferralEnginePage({super.key});
 @override
 Widget build(BuildContext context){
  return Directionality(
   textDirection: TextDirection.rtl,
   child: Scaffold(
    appBar: AppBar(title: const Text('الإحالات')),
    body: const Padding(
     padding: EdgeInsets.all(18),
     child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Growth, Marketing & Network Effect OS.'))),
    ),
   ),
  );
 }
}
