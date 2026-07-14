import 'package:flutter/material.dart';

class BuyerMatchingPage extends StatelessWidget {
  const BuyerMatchingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('مطابقة المشترين')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: const [
            Card(
              child: Padding(
                padding: EdgeInsets.all(18),
                child: Text(
                  'ترتيب المركبات حسب ملاءمتها للمشتري.',
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
