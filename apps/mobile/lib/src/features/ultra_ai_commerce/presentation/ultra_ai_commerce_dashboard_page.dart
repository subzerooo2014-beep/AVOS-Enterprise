import 'package:flutter/material.dart';

class UltraAiCommerceDashboardPage extends StatelessWidget {
  const UltraAiCommerceDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('مركز ذكاء التجارة والسيارات')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: const [
            Card(
              child: Padding(
                padding: EdgeInsets.all(18),
                child: Text(
                  'لوحة موحدة لجميع محركات الذكاء الاصطناعي.',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
