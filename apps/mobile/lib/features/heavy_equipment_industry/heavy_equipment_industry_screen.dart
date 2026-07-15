import "package:flutter/material.dart";

class HeavyEquipmentIndustryScreen extends StatelessWidget {
  const HeavyEquipmentIndustryScreen({super.key});

  static const domains = <({String title, IconData icon})>[
    (title: "Fleet & Assets", icon: Icons.precision_manufacturing_outlined),
    (title: "Sites & Deployment", icon: Icons.location_city_outlined),
    (title: "Maintenance", icon: Icons.build_outlined),
    (title: "Inspections & Safety", icon: Icons.health_and_safety_outlined),
    (title: "Rental & Sales", icon: Icons.handshake_outlined),
    (title: "Spare Parts", icon: Icons.inventory_2_outlined),
    (title: "Telematics", icon: Icons.sensors_outlined),
    (title: "AI Intelligence", icon: Icons.psychology_outlined),
    (title: "Executive Dashboard", icon: Icons.dashboard_outlined),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Heavy Equipment"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "AVOS Heavy Equipment Industry Pack",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            "Fleet operations, sites, maintenance, rentals, safety, "
            "telematics, and AI intelligence.",
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const SizedBox(height: 20),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.15,
            ),
            itemCount: domains.length,
            itemBuilder: (context, index) {
              final domain = domains[index];

              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(domain.icon, size: 32),
                      const SizedBox(height: 10),
                      Text(
                        domain.title,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}