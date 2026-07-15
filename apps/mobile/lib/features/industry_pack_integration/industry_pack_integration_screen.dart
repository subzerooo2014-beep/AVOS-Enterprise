import "package:flutter/material.dart";

class IndustryPackIntegrationScreen extends StatelessWidget {
  const IndustryPackIntegrationScreen({super.key});

  static const packs = <String>[
    "Automotive Industry Pack",
    "Heavy Equipment Industry Pack",
    "Industry Mega Bundle 1",
    "Industry Ultra Bundle 2-3",
    "Industry Ultra Bundle 4-5",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Industry Pack Integration")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Industry Pack Integration & Migration V1",
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 16),
          ...packs.map(
            (pack) => Card(
              child: ListTile(
                leading: const Icon(Icons.sync_alt_outlined),
                title: Text(pack),
                subtitle: const Text("Universal Industry Core integration"),
              ),
            ),
          ),
        ],
      ),
    );
  }
}