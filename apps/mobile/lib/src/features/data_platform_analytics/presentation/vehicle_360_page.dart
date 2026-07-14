import 'package:flutter/material.dart';
class Vehicle360Page extends StatelessWidget {
  const Vehicle360Page({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('Vehicle 360')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Data Platform, Analytics & Intelligence OS.'))),
        ),
      ),
    );
  }
}
