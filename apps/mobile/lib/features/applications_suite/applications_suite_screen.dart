import "package:flutter/material.dart";

import "applications_suite_registry.dart";

class ApplicationsSuiteScreen extends StatelessWidget {
  const ApplicationsSuiteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Applications")),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: ApplicationsSuiteRegistry.applications.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final application = ApplicationsSuiteRegistry.applications[index];

          return Card(
            child: ListTile(
              title: Text(application.name),
              subtitle: Text(
                "${application.capabilities.length} capabilities",
              ),
              trailing: const Icon(Icons.chevron_right),
            ),
          );
        },
      ),
    );
  }
}