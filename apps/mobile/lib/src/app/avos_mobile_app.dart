import 'package:flutter/material.dart';
import '../../../design_system/avos_theme.dart';
import '../features/home/presentation/home_page.dart';

class AvosMobileApp extends StatelessWidget {
  const AvosMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AVOS Mobile',
      debugShowCheckedModeBanner: false,
      theme: AvosLuxuryTheme.light,
      home: const HomePage(),
    );
  }
}