import 'package:flutter/material.dart';

class BudgetPlannerPage extends StatelessWidget {
  const BudgetPlannerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('تخطيط الميزانية')),
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
