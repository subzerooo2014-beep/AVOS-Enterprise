import 'package:flutter/material.dart';
class CollaborationRoomsPage extends StatelessWidget {
  const CollaborationRoomsPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('غرف التعاون')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Communication, Collaboration & Customer Engagement OS.'))),
        ),
      ),
    );
  }
}
