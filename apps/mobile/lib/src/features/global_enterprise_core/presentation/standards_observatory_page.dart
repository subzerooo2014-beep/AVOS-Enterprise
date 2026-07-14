import 'package:flutter/material.dart';

class StandardsObservatoryPage extends StatelessWidget {
  const StandardsObservatoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('مرصد المعايير')),
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
