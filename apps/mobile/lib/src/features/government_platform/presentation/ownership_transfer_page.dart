import 'package:flutter/material.dart';

class OwnershipTransferPage extends StatelessWidget {
  const OwnershipTransferPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('نقل الملكية')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text(
                'واجهة تشغيلية ضمن منصة AVOS الحكومية في وضع Sandbox.',
              ),
            ),
          ),
        ),
      ),
    );
  }
}
