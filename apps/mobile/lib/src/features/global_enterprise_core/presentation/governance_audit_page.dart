import 'package:flutter/material.dart';

class GovernanceAuditPage extends StatelessWidget {
  const GovernanceAuditPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('تدقيق الحوكمة')),
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
