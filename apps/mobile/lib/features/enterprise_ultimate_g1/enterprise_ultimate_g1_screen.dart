import "package:flutter/material.dart";

class EnterpriseUltimateG1Screen extends StatelessWidget {
  const EnterpriseUltimateG1Screen({super.key});

  static const _navy = Color(0xFF18324A);
  static const _gold = Color(0xFFB8924A);
  static const _sand = Color(0xFFEDE5D8);
  static const _card = Color(0xFFFFFDF8);

  static const capabilities = <String>[
    "Global Design System",
    "AVOS Brand Runtime",
    "Logo System",
    "Light Theme Engine",
    "Dark Theme Engine",
    "RTL/LTR Engine",
    "Arabic Localization",
    "English Localization",
    "Responsive Web Shell",
    "Mobile App Shell",
    "Accessibility Engine",
    "Global Navigation",
    "Global Search",
    "Notification Center",
    "Profile Center",
    "Onboarding Engine",
    "Authentication Experience",
    "Landing Experience",
    "Marketplace Experience",
    "Vehicle Detail Experience",
    "Deal Experience",
    "Auction Experience",
    "Chat Experience",
    "AI Assistant Experience",
    "Admin Experience",
    "Dealer Experience",
    "Partner Experience",
    "Design Tokens",
    "UI Component Library",
    "Experience Configuration Center",
  ];

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: _sand,
        appBar: AppBar(
          backgroundColor: _card,
          foregroundColor: _navy,
          title: const Row(
            children: [
              CircleAvatar(
                backgroundColor: _navy,
                child: Text(
                  "AV",
                  style: TextStyle(
                    color: Color(0xFFD7BC83),
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
              SizedBox(width: 12),
              Text("AVOS Enterprise G1"),
            ],
          ),
        ),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                color: _card,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFD8CDBE)),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "مرحبا الساع",
                    style: TextStyle(
                      color: _gold,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    "تجربة AVOS العالمية",
                    style: TextStyle(
                      color: _navy,
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            ...capabilities.map(
              (item) => Card(
                color: _card,
                child: ListTile(
                  leading: const Icon(Icons.auto_awesome_outlined, color: _gold),
                  title: Text(
                    item,
                    style: const TextStyle(
                      color: _navy,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}