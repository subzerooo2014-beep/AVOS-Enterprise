import 'package:flutter/material.dart';

class MarketplaceListingsPage extends StatelessWidget {
  const MarketplaceListingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('الإعلانات')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن منظومة AVOS Marketplace Ecosystem.'),
            ),
          ),
        ),
      ),
    );
  }
}
