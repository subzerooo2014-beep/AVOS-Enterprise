import 'package:flutter/material.dart';

class MediaUploadPage extends StatelessWidget {
  const MediaUploadPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('رفع الصور والفيديو')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن رحلة بيع المركبة الكاملة.'),
            ),
          ),
        ),
      ),
    );
  }
}
