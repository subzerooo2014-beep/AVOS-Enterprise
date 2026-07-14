import 'package:flutter/material.dart';
class FineTuningRunsPage extends StatelessWidget {
  const FineTuningRunsPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('تشغيل Fine-tuning')),
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
