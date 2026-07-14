import 'package:flutter/material.dart';

class LuxuryCard extends StatelessWidget {
  const LuxuryCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
  });

  final Widget child;
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.94),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.black.withValues(alpha: 0.05)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F8F74).withValues(alpha: 0.10),
            blurRadius: 30,
            offset: const Offset(0, 14),
          ),
        ],
      ),
      child: child,
    );
  }
}