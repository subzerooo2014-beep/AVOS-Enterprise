import 'package:flutter/material.dart';
class EngagementAnalyticsPage extends StatelessWidget {
  const EngagementAnalyticsPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('تحليلات التفاعل')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(child: Padding(padding: EdgeInsets.all(18),child: Text('واجهة تشغيلية ضمن AVOS Communication, Collaboration & Customer Engagement OS.'))),
        ),
      ),
    );
  }
}
