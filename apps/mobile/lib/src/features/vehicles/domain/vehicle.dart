class Vehicle {
  const Vehicle({
    required this.id,
    required this.title,
    required this.price,
    required this.year,
    required this.location,
    required this.trustScore,
    required this.isFavorite,
  });

  final String id;
  final String title;
  final int price;
  final int year;
  final String location;
  final int trustScore;
  final bool isFavorite;
}