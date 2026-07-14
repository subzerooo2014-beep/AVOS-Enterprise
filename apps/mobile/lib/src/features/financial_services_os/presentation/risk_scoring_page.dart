import 'package:flutter/material.dart';
class RiskScoringPage extends StatelessWidget {
 const RiskScoringPage({super.key});
 @override
 Widget build(BuildContext context){
  return Directionality(
   textDirection: TextDirection.rtl,
   child: Scaffold(
    appBar: AppBar(title: const Text('تقييم المخاطر')),
    body: const Padding(
     padding: EdgeInsets.all(18),
     child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Financial Services, Payments & Insurance OS.'))),
    ),
   ),
  );
 }
}
