import 'package:flutter/material.dart';

class NegotiationAiPage extends StatelessWidget {
  const NegotiationAiPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('التفاوض الذكي')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: const [
            Card(
              child: Padding(
                padding: EdgeInsets.all(18),
                child: Text(
                  'تقييم العروض واقتراح الرد المناسب.',
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
