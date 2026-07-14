import 'package:flutter/material.dart';

class ControlTowerPage extends StatelessWidget {
  const ControlTowerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('برج التحكم')),
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
