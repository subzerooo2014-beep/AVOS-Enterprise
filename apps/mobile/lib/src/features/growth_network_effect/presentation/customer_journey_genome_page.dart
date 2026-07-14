import 'package:flutter/material.dart';
class CustomerJourneyGenomePage extends StatelessWidget {
 const CustomerJourneyGenomePage({super.key});
 @override
 Widget build(BuildContext context){
  return Directionality(
   textDirection: TextDirection.rtl,
   child: Scaffold(
    appBar: AppBar(title: const Text('جينوم رحلة العميل')),
    body: const Padding(
     padding: EdgeInsets.all(18),
     child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Growth, Marketing & Network Effect OS.'))),
    ),
   ),
  );
 }
}
