import "package:flutter/material.dart";

class IndustryMegaBundle1Screen extends StatelessWidget {
  const IndustryMegaBundle1Screen({super.key});

  static const industries = <String>[
    "Healthcare",
    "Construction",
    "Manufacturing",
    "Logistics & Fleet",
    "Real Estate",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Industry Mega Bundle 1")),
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
                leading: const Icon(Icons.apartment_outlined),
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