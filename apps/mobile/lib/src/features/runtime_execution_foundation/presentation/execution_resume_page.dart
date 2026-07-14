import 'package:flutter/material.dart';

class ExecutionResumePage extends StatelessWidget {
  const ExecutionResumePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('استئناف التنفيذ')),
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
