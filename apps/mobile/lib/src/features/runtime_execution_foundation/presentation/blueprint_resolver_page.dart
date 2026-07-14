import 'package:flutter/material.dart';

class BlueprintResolverPage extends StatelessWidget {
  const BlueprintResolverPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('حل اعتماديات Blueprint')),
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
