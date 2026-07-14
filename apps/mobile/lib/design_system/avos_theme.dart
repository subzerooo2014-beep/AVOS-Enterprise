import 'package:flutter/material.dart';
import 'avos_colors.dart';

class AvosLuxuryTheme {
  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AvosColors.ivory,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AvosColors.emerald,
        brightness: Brightness.light,
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: Colors.white.withValues(alpha: 0.94),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(28),
          side: BorderSide(color: Colors.black.withValues(alpha: 0.05)),
        ),
      ),
      navigationBarTheme: const NavigationBarThemeData(
        indicatorColor: Color(0xFFD7F7EE),
      ),
    );
  }
}