import "package:flutter/material.dart";
import "avos_components.dart";
import "avos_design_tokens.dart";

class DesignSystemFoundationScreen extends StatelessWidget {
  const DesignSystemFoundationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("AVOS Design System"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AvosSpacing.lg),
        children: [
          const Text(
            "The Operating System for Mobility",
            style: TextStyle(
              color: AvosColors.textSecondary,
            ),
          ),
          const SizedBox(height: AvosSpacing.sm),
          const Text(
            "Design System Foundation V1",
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: AvosSpacing.xl),
          const AvosMetricCard(
            label: "Theme Strategy",
            value: "Light First",
            detail: "Premium enterprise visual foundation",
          ),
          const SizedBox(height: AvosSpacing.md),
          const AvosMetricCard(
            label: "Accessibility",
            value: "WCAG 2.2 AA",
            detail: "Accessible components and interaction states",
          ),
          const SizedBox(height: AvosSpacing.md),
          const AvosMetricCard(
            label: "Languages",
            value: "Arabic + English",
            detail: "RTL and LTR product readiness",
          ),
          const SizedBox(height: AvosSpacing.xl),
          AvosPrimaryButton(
            label: "Explore Components",
            onPressed: () {},
          ),
        ],
      ),
    );
  }
}