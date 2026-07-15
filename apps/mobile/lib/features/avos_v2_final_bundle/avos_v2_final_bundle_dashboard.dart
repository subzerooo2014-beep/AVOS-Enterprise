import 'package:flutter/material.dart';

class AvosV2FinalBundleDashboard extends StatelessWidget {
  const AvosV2FinalBundleDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AVOS V2 Final Bundle')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          ListTile(
            title: Text('Enterprise Data Platform'),
            trailing: Text('40 capabilities'),
          ),
          ListTile(
            title: Text('Enterprise Automation OS'),
            trailing: Text('40 capabilities'),
          ),
          ListTile(
            title: Text('Global Cloud Platform'),
            trailing: Text('40 capabilities'),
          ),
          ListTile(
            title: Text('Total'),
            trailing: Text('120 capabilities'),
          ),
        ],
      ),
    );
  }
}
