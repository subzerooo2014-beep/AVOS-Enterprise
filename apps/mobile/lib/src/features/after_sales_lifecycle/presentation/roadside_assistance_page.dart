import 'package:flutter/material.dart';
class RoadsideAssistancePage extends StatelessWidget {
  const RoadsideAssistancePage({super.key});
  @override
  Widget build(BuildContext context){
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('المساعدة على الطريق')),
        body: const Padding(
          padding: EdgeInsets.all(18),
          child: Card(
            child: Padding(
              padding: EdgeInsets.all(18),
              child: Text('واجهة تشغيلية ضمن AVOS After-Sales & Vehicle Lifecycle OS.'),
            ),
          ),
        ),
      ),
    );
  }
}
