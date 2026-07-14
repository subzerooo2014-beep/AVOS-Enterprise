import 'package:flutter/material.dart';
import '../../../../design_system/avos_colors.dart';
import '../../../../design_system/azm_orb.dart';
import '../../../../design_system/luxury_card.dart';
import '../../favorites/presentation/favorites_page.dart';
import '../../profile/presentation/profile_page.dart';
import '../../vehicles/presentation/vehicles_page.dart';
import '../../azm/presentation/azm_assistant_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _index = 0;

  final _pages = const [
    _LuxuryHome(),
    VehiclesPage(),
    FavoritesPage(),
    ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        body: _pages[_index],
        floatingActionButton: FloatingActionButton.extended(
          backgroundColor: AvosColors.emerald,
          foregroundColor: Colors.white,
          onPressed: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const AzmAssistantPage()),
            );
          },
          label: const Text('عزم AI'),
          icon: const Icon(Icons.auto_awesome),
        ),
        bottomNavigationBar: NavigationBar(
          selectedIndex: _index,
          onDestinationSelected: (value) => setState(() => _index = value),
          destinations: const [
            NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'الرئيسية'),
            NavigationDestination(icon: Icon(Icons.directions_car_outlined), selectedIcon: Icon(Icons.directions_car), label: 'المركبات'),
            NavigationDestination(icon: Icon(Icons.favorite_outline), selectedIcon: Icon(Icons.favorite), label: 'المفضلة'),
            NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'حسابي'),
          ],
        ),
      ),
    );
  }
}

class _LuxuryHome extends StatelessWidget {
  const _LuxuryHome();

  @override
  Widget build(BuildContext context) {
    final actions = [
      ('شراء', Icons.shopping_bag_outlined),
      ('بيع', Icons.sell_outlined),
      ('مزاد', Icons.gavel_outlined),
      ('تفاوض', Icons.handshake_outlined),
    ];

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(18, 20, 18, 110),
        children: [
          const Text(
            'مرحبا الساع',
            style: TextStyle(
              fontSize: 34,
              fontWeight: FontWeight.w900,
              color: AvosColors.ink,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'شو في خاطرك اليوم؟',
            style: TextStyle(
              fontSize: 20,
              color: AvosColors.muted,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 24),
          const Center(child: AzmOrb()),
          const SizedBox(height: 24),
          LuxuryCard(
            child: Column(
              children: [
                TextField(
                  decoration: InputDecoration(
                    hintText: 'أريد سيارة عائلية أقل من 250 ألف',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: const Icon(Icons.tune),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: FilledButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.keyboard),
                        label: const Text('اكتب'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.mic),
                        label: const Text('تحدث'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.camera_alt_outlined),
                        label: const Text('صورة'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          LuxuryCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'اختيار عزم اليوم',
                  style: TextStyle(
                    color: AvosColors.emerald,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'سيارة عائلية موثوقة بسعر أقل من السوق',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 18),
                Container(
                  height: 180,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFE5EFEB), Color(0xFFF9FBFA)],
                    ),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.directions_car_filled,
                      size: 92,
                      color: Color(0xFF445550),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: actions.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.45,
            ),
            itemBuilder: (context, index) {
              final action = actions[index];
              return LuxuryCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(action.$2, size: 30, color: AvosColors.emerald),
                    const SizedBox(height: 8),
                    Text(
                      action.$1,
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}