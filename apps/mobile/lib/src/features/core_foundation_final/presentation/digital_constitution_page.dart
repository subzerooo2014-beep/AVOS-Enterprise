import 'package:flutter/material.dart';

class DigitalConstitutionPage extends StatelessWidget {
  const DigitalConstitutionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('الدستور الرقمي')),
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
