import 'package:flutter/material.dart';

class ExecutionPlannerPage extends StatelessWidget {
  const ExecutionPlannerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('مخطط التنفيذ')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS Runtime & Execution Foundation.'),
            ),
          ),
        ),
      ),
    );
  }
}
