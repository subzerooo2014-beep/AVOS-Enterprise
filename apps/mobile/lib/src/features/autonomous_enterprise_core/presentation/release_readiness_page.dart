import 'package:flutter/material.dart';

class ReleaseReadinessPage extends StatelessWidget {
  const ReleaseReadinessPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('جاهزية الإصدار')),
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
