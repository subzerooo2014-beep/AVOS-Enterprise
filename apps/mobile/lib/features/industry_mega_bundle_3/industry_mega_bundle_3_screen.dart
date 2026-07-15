import "package:flutter/material.dart";

class IndustryMegaBundle3Screen extends StatelessWidget {
  const IndustryMegaBundle3Screen({super.key});

  static const industries = <String>[
    "Insurance",
    "Retail & Commerce",
    "Hospitality",
    "Education",
    "Government",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Industry Mega Bundle 3")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Industry Expansion",
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 16),
          ...industries.map(
            (industry) => Card(
              child: ListTile(
                leading: const Icon(Icons.business_center_outlined),
                title: Text(industry),
                trailing: const Icon(Icons.chevron_right),
              ),
            ),
          ),
        ],
      ),
    );
  }
}