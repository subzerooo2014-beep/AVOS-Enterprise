import 'package:flutter/material.dart';

class DependencyPlannerPage extends StatelessWidget {
  const DependencyPlannerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('تخطيط الاعتماديات')),
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
