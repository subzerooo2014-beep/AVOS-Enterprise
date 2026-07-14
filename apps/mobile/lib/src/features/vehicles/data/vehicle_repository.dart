import '../domain/vehicle.dart';

class VehicleRepository {
  Future<List<Vehicle>> fetchVehicles() async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    return const [
      Vehicle(id: 'land-cruiser-2024', title: 'Toyota Land Cruiser 2024', price: 289000, year: 2024, location: 'دبي', trustScore: 96, isFavorite: true),
      Vehicle(id: 'patrol-2023', title: 'Nissan Patrol 2023', price: 245000, year: 2023, location: 'أبوظبي', trustScore: 93, isFavorite: false),
      Vehicle(id: 'model-y-2024', title: 'Tesla Model Y 2024', price: 179000, year: 2024, location: 'دبي', trustScore: 94, isFavorite: true),
      Vehicle(id: 'gle-2024', title: 'Mercedes GLE 2024', price: 319000, year: 2024, location: 'الشارقة', trustScore: 91, isFavorite: false),
    ];
  }
}