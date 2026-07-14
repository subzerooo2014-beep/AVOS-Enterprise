import 'package:flutter/material.dart';

class TaskDistributionPage extends StatelessWidget {
  const TaskDistributionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('توزيع المهام')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS Autonomous Intelligence & Decision Platform.'),
            ),
          ),
        ),
      ),
    );
  }
}
