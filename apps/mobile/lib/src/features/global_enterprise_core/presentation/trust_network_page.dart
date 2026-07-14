import 'package:flutter/material.dart';

class TrustNetworkPage extends StatelessWidget {
  const TrustNetworkPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('شبكة الثقة')),
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
