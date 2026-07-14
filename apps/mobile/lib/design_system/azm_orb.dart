import 'package:flutter/material.dart';
import 'avos_colors.dart';

class AzmOrb extends StatelessWidget {
  const AzmOrb({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 164,
      height: 164,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const RadialGradient(
          center: Alignment(-0.35, -0.35),
          colors: [
            Colors.white,
            Color(0xFFD8FFF4),
            Color(0xFF57D8B5),
            AvosColors.emerald,
          ],
          stops: [0, 0.30, 0.62, 1],
        ),
        boxShadow: [
          BoxShadow(
            color: AvosColors.emerald.withValues(alpha: 0.34),
            blurRadius: 44,
            spreadRadius: 6,
          ),
        ],
      ),
      child: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'عزم',
              style: TextStyle(
                color: Colors.white,
                fontSize: 34,
                fontWeight: FontWeight.w900,
              ),
            ),
            Text(
              'AI',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}