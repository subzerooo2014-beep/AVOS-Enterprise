import 'package:flutter/material.dart';
import '../data/vehicle_repository.dart';
import '../domain/vehicle.dart';

class VehiclesPage extends StatefulWidget {
  const VehiclesPage({super.key});

  @override
  State<VehiclesPage> createState() => _VehiclesPageState();
}

class _VehiclesPageState extends State<VehiclesPage> {
  final _repository = VehicleRepository();
  final _searchController = TextEditingController();
  String _city = 'الكل';
  late Future<List<Vehicle>> _future;

  @override
  void initState() {
    super.initState();
    _future = _repository.fetchVehicles();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: FutureBuilder<List<Vehicle>>(
        future: _future,
        builder: (context, snapshot) {
          final vehicles = snapshot.data ?? const <Vehicle>[];
          final query = _searchController.text.trim().toLowerCase();
          final filtered = vehicles.where((v) {
            final queryMatch = query.isEmpty || v.title.toLowerCase().contains(query);
            final cityMatch = _city == 'الكل' || v.location == _city;
            return queryMatch && cityMatch;
          }).toList();

          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              const Text('المركبات', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900)),
              const SizedBox(height: 16),
              TextField(
                controller: _searchController,
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  hintText: 'ابحث عن مركبة...',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(20)),
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: ['الكل', 'دبي', 'أبوظبي', 'الشارقة']
                    .map((city) => ChoiceChip(
                          label: Text(city),
                          selected: _city == city,
                          onSelected: (_) => setState(() => _city = city),
                        ))
                    .toList(),
              ),
              const SizedBox(height: 18),
              if (snapshot.connectionState == ConnectionState.waiting)
                const Center(child: CircularProgressIndicator())
              else
                ...filtered.map((vehicle) => _VehicleCard(vehicle: vehicle)),
            ],
          );
        },
      ),
    );
  }
}

class _VehicleCard extends StatelessWidget {
  const _VehicleCard({required this.vehicle});
  final Vehicle vehicle;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(height: 180, decoration: const BoxDecoration(gradient: LinearGradient(colors: [Color(0xFFE2E8F0), Color(0xFFCBD5E1)]))),
          Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(vehicle.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                const SizedBox(height: 8),
                Text('AED ${vehicle.price}', style: const TextStyle(color: Color(0xFF059669), fontSize: 20, fontWeight: FontWeight.w900)),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Text('${vehicle.year} • ${vehicle.location}'),
                    const Spacer(),
                    Text('الثقة ${vehicle.trustScore}%'),
                    const SizedBox(width: 8),
                    Icon(vehicle.isFavorite ? Icons.favorite : Icons.favorite_outline, color: vehicle.isFavorite ? Colors.red : null),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}