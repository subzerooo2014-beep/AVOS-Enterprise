import 'package:flutter/material.dart';
import '../../../../design_system/luxury_card.dart';
import '../../vehicles/domain/vehicle.dart';

class VehicleCommercePage extends StatelessWidget {
  const VehicleCommercePage({
    super.key,
    required this.vehicle,
  });

  final Vehicle vehicle;

  @override
  Widget build(BuildContext context) {
    final monthly = ((vehicle.price * 0.82) / 60).round();

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('التمويل والتأمين')),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            LuxuryCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'عرض تمويل مبدئي',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'AED $monthly شهرياً',
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text('لمدة 60 شهراً'),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const LuxuryCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'عرض تأمين شامل',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'ابتداءً من AED 5,900 سنوياً',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}