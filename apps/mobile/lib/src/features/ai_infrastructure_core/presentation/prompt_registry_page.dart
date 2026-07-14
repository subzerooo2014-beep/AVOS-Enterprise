import 'package:flutter/material.dart';
class PromptRegistryPage extends StatelessWidget {
  const PromptRegistryPage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('سجل الأوامر')),
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
