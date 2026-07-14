import 'package:flutter/material.dart';
import '../../../../design_system/avos_colors.dart';
import '../../../../design_system/luxury_card.dart';
import '../../chat/presentation/seller_chat_page.dart';
import '../../commerce/presentation/vehicle_commerce_page.dart';
import '../../maps/presentation/vehicle_location_page.dart';
import '../domain/vehicle.dart';

class VehicleDetailsPage extends StatefulWidget {
  const VehicleDetailsPage({
    super.key,
    required this.vehicle,
  });

  final Vehicle vehicle;

  @override
  State<VehicleDetailsPage> createState() => _VehicleDetailsPageState();
}

class _VehicleDetailsPageState extends State<VehicleDetailsPage> {
  bool _favorite = false;

  @override
  void initState() {
    super.initState();
    _favorite = widget.vehicle.isFavorite;
  }

  @override
  Widget build(BuildContext context) {
    final vehicle = widget.vehicle;

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('تفاصيل المركبة'),
          actions: [
            IconButton(
              onPressed: () => setState(() => _favorite = !_favorite),
              icon: Icon(
                _favorite ? Icons.favorite : Icons.favorite_outline,
                color: _favorite ? Colors.red : null,
              ),
            ),
          ],
        ),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(18, 12, 18, 30),
          children: [
            Hero(
              tag: 'vehicle-${vehicle.id}',
              child: Container(
                height: 270,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFDCE8E3), Color(0xFFF9FBFA)],
                  ),
                  borderRadius: BorderRadius.circular(32),
                ),
                child: const Center(
                  child: Icon(
                    Icons.directions_car_filled,
                    size: 124,
                    color: Color(0xFF3E514B),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 18),
            LuxuryCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    vehicle.title,
                    style: const TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'AED ${vehicle.price}',
                    style: const TextStyle(
                      color: AvosColors.emerald,
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 14),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      _InfoChip(label: '${vehicle.year}', icon: Icons.calendar_today),
                      _InfoChip(label: vehicle.location, icon: Icons.location_on_outlined),
                      _InfoChip(label: 'الثقة ${vehicle.trustScore}%', icon: Icons.verified_user_outlined),
                      const _InfoChip(label: 'مالك أول', icon: Icons.person_outline),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const LuxuryCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'تحليل عزم',
                    style: TextStyle(
                      color: AvosColors.emerald,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'سعر عادل، حالة ممتازة، وفرصة مناسبة للشراء.',
                    style: TextStyle(
                      fontSize: 19,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: FilledButton.icon(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => SellerChatPage(vehicle: vehicle),
                        ),
                      );
                    },
                    icon: const Icon(Icons.chat_bubble_outline),
                    label: const Text('تواصل مع البائع'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => VehicleLocationPage(vehicle: vehicle),
                        ),
                      );
                    },
                    icon: const Icon(Icons.map_outlined),
                    label: const Text('الموقع'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            OutlinedButton.icon(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => VehicleCommercePage(vehicle: vehicle),
                  ),
                );
              },
              icon: const Icon(Icons.account_balance_outlined),
              label: const Text('التمويل والتأمين'),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  const _InfoChip({
    required this.label,
    required this.icon,
  });

  final String label;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Chip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
    );
  }
}