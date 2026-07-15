import "package:flutter/material.dart";
import "avos_design_tokens.dart";

class AvosPrimaryButton extends StatelessWidget {
  const AvosPrimaryButton({
    required this.label,
    required this.onPressed,
    super.key,
  });

  final String label;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 48,
      child: FilledButton(
        onPressed: onPressed,
        child: Text(label),
      ),
    );
  }
}

class AvosMetricCard extends StatelessWidget {
  const AvosMetricCard({
    required this.label,
    required this.value,
    this.detail,
    super.key,
  });

  final String label;
  final String value;
  final String? detail;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AvosSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(
                color: AvosColors.textSecondary,
              ),
            ),
            const SizedBox(height: AvosSpacing.sm),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            ),
            if (detail != null) ...[
              const SizedBox(height: AvosSpacing.sm),
              Text(
                detail!,
                style: const TextStyle(
                  color: AvosColors.textSecondary,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}