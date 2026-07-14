import 'package:flutter/material.dart';

class GlobalEnterpriseDashboardPage extends StatelessWidget {
  const GlobalEnterpriseDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('لوحة المؤسسة العالمية')),
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
