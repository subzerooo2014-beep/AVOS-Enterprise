import 'package:flutter/material.dart';
import '../../vehicles/data/vehicle_repository.dart';
import '../../vehicles/domain/vehicle.dart';

class FavoritesPage extends StatelessWidget {
  const FavoritesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: FutureBuilder<List<Vehicle>>(
        future: VehicleRepository().fetchVehicles(),
        builder: (context, snapshot) {
          final items = (snapshot.data ?? const <Vehicle>[]).where((v) => v.isFavorite).toList();
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              const Text('المفضلة', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900)),
              const SizedBox(height: 18),
              if (snapshot.connectionState == ConnectionState.waiting)
                const Center(child: CircularProgressIndicator())
              else
                ...items.map((vehicle) => Card(
                      margin: const EdgeInsets.only(bottom: 14),
                      child: ListTile(
                        leading: const CircleAvatar(child: Icon(Icons.directions_car)),
                        title: Text(vehicle.title),
                        subtitle: Text('AED ${vehicle.price}'),
                        trailing: const Icon(Icons.favorite, color: Colors.red),
                      ),
                    )),
            ],
          );
        },
      ),
    );
  }
}