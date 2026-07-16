import "package:flutter/material.dart";

class {{MOBILE_CLASS}} extends StatelessWidget {
  const {{MOBILE_CLASS}}({super.key});

  static const capabilities = <String>[
{{WEB_CAPABILITIES}}
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("{{TITLE}}")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: capabilities
            .map(
              (item) => Card(
                child: ListTile(
                  leading: const Icon(Icons.auto_awesome_outlined),
                  title: Text(item),
                ),
              ),
            )
            .toList(),
      ),
    );
  }
}