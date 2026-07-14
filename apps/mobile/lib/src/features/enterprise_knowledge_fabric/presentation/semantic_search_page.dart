import 'package:flutter/material.dart';
class SemanticSearchPage extends StatelessWidget {
  const SemanticSearchPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('البحث الدلالي')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS Enterprise Knowledge Fabric.'),
            ),
          ),
        ),
      ),
    );
  }
}
