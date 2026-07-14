import 'package:flutter/material.dart';

class DynamicLanguageLoadingPage extends StatelessWidget {
  const DynamicLanguageLoadingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('تحميل اللغات')),
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
