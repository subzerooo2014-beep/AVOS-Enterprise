import 'package:flutter/material.dart';
class InsuranceMarketplacePage extends StatelessWidget {
 const InsuranceMarketplacePage({super.key});
 @override
 Widget build(BuildContext context){
  return Directionality(
   textDirection: TextDirection.rtl,
   child: Scaffold(
    appBar: AppBar(title: const Text('سوق التأمين')),
    body: const Padding(
     padding: EdgeInsets.all(18),
     child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Financial Services, Payments & Insurance OS.'))),
    ),
   ),
  );
 }
}
