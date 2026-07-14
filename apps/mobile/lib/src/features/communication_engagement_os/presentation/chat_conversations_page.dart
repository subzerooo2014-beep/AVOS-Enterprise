import 'package:flutter/material.dart';
class ChatConversationsPage extends StatelessWidget {
  const ChatConversationsPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('المحادثات')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Communication, Collaboration & Customer Engagement OS.'))),
        ),
      ),
    );
  }
}
