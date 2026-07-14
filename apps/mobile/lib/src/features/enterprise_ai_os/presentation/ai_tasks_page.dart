import 'package:flutter/material.dart';

class AiTasksPage extends StatelessWidget {
  const AiTasksPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('مهام الذكاء الاصطناعي')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text(
                'واجهة تشغيلية ضمن منصة AVOS Enterprise AI OS.',
              ),
            ),
          ),
        ),
      ),
    );
  }
}
