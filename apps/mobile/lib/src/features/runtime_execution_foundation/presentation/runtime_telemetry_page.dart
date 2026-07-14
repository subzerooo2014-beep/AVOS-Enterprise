import 'package:flutter/material.dart';

class RuntimeTelemetryPage extends StatelessWidget {
  const RuntimeTelemetryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('قياسات Runtime')),
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
