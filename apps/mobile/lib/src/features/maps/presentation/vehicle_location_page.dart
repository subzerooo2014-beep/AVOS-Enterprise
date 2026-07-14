import 'package:flutter/material.dart';
import '../../vehicles/domain/vehicle.dart';

class VehicleLocationPage extends StatelessWidget {
  const VehicleLocationPage({
    super.key,
    required this.vehicle,
  });

  final Vehicle vehicle;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(title: const Text('موقع المركبة')),
        body: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFE7F1ED),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.location_on,
                      size: 90,
                      color: Color(0xFF0F8F74),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: const CircleAvatar(
                  child: Icon(Icons.directions_car),
                ),
                title: Text(vehicle.title),
                subtitle: Text(vehicle.location),
                trailing: FilledButton(
                  onPressed: () {},
                  child: const Text('الاتجاهات'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}