import 'package:flutter/material.dart';
class EvaluationSuitesPage extends StatelessWidget {
  const EvaluationSuitesPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('حزم التقييم')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS AI Infrastructure Core.'),
            ),
          ),
        ),
      ),
    );
  }
}
