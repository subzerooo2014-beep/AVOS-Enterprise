import 'package:flutter/material.dart';

class DecisionExplainabilityPage extends StatelessWidget {
  const DecisionExplainabilityPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('تفسير القرار')),
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
