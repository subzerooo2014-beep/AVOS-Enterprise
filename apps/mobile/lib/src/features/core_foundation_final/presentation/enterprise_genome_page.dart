import 'package:flutter/material.dart';

class EnterpriseGenomePage extends StatelessWidget {
  const EnterpriseGenomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('جينوم المؤسسة')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS Core Foundation Final.'),
            ),
          ),
        ),
      ),
    );
  }
}
