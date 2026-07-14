import 'package:flutter/material.dart';
class KnowledgeLineagePage extends StatelessWidget {
  const KnowledgeLineagePage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('نسب المعرفة')),
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
