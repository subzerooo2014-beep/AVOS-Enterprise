import 'package:flutter/material.dart';

class SelfEvolutionPage extends StatelessWidget {
  const SelfEvolutionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('التطور الذاتي')),
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
