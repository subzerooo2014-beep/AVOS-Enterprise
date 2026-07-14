import 'package:flutter/material.dart';

class EvolutionApprovalsPage extends StatelessWidget {
  const EvolutionApprovalsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('اعتمادات التطور')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS Autonomous Enterprise Core.'),
            ),
          ),
        ),
      ),
    );
  }
}
