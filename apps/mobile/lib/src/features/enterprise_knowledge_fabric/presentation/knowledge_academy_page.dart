import 'package:flutter/material.dart';
class KnowledgeAcademyPage extends StatelessWidget {
  const KnowledgeAcademyPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('أكاديمية المعرفة')),
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
