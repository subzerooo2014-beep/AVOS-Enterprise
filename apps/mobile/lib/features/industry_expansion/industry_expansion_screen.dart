import "package:flutter/material.dart";

class IndustryExpansionScreen extends StatelessWidget {
  const IndustryExpansionScreen({super.key});

  static const verticals = <String>[
    "Cars",
    "Motorcycles",
    "Trucks",
    "Heavy Equipment",
    "Boats & Yachts",
    "Aircraft",
    "Number Plates",
    "Accessories & Parts",
    "Classic Vehicles",
    "Caravans & Campers",
    "Fleet & Mobility",
    "Export Only"
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Industry Expansion")),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1.2,
        ),
        itemCount: verticals.length,
        itemBuilder: (context, index) {
          return Card(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Text(
                  verticals[index],
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}