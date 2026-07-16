import "package:flutter/material.dart";

class CodegenRuntimeEnginesScreen extends StatelessWidget {
  const CodegenRuntimeEnginesScreen({super.key});

  static const capabilities = <String>[
    "Template Compiler",
    "Template Runtime",
    "Variable Schema Engine",
    "Blueprint Dependency Graph",
    "Capability Resolver",
    "Conflict Resolution Engine",
    "Output Safety Engine",
    "Validation Runtime",
    "End To End Validation Pipeline",
    "Codegen Evidence",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS CodeGen Runtime Engines")),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: capabilities.length,
        itemBuilder: (context, index) => Card(
          child: ListTile(
            leading: const Icon(Icons.auto_awesome),
            title: Text(capabilities[index]),
          ),
        ),
      ),
    );
  }
}