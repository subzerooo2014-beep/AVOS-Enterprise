import 'package:flutter/material.dart';

class TerminologyPage extends StatelessWidget {
  const TerminologyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('المصطلحات')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS Global Language Platform.'),
            ),
          ),
        ),
      ),
    );
  }
}
