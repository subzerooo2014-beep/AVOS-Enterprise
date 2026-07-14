import 'package:flutter/material.dart';
class InsuranceQuotesPage extends StatelessWidget {
 const InsuranceQuotesPage({super.key});
 @override
 Widget build(BuildContext context){
  return Directionality(
   textDirection: TextDirection.rtl,
   child: Scaffold(
    appBar: AppBar(title: const Text('عروض التأمين')),
    body: const Padding(
     padding: EdgeInsets.all(18),
     child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Financial Services, Payments & Insurance OS.'))),
    ),
   ),
  );
 }
}
