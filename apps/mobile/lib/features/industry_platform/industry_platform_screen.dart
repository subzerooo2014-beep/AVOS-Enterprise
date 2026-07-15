import "package:flutter/material.dart";

class IndustryPlatformScreen extends StatelessWidget {
  const IndustryPlatformScreen({super.key});

  static const industries = <String>[
    "Cars",
    "Motorcycles",
    "Buggy",
    "Heavy Equipment",
    "Marine",
    "Aviation",
    "Camping",
    "Trucks",
    "Buses",
    "Caravans",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AVOS Industry Platform")),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1.2,
        ),
        itemCount: industries.length,
        itemBuilder: (context, index) {
          return Card(
            child: Center(
              child: Text(
                industries[index],
                textAlign: TextAlign.center,
              ),
            ),
          );
        },
      ),
    );
  }
}