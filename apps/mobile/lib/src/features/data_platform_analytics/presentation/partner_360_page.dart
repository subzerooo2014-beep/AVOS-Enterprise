import 'package:flutter/material.dart';
class Partner360Page extends StatelessWidget {
  const Partner360Page({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('Partner 360')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Data Platform, Analytics & Intelligence OS.'))),
        ),
      ),
    );
  }
}
