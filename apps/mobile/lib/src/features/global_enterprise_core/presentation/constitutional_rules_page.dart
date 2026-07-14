import 'package:flutter/material.dart';

class ConstitutionalRulesPage extends StatelessWidget {
  const ConstitutionalRulesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('القواعد الدستورية')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS Global Enterprise Core.'),
            ),
          ),
        ),
      ),
    );
  }
}
