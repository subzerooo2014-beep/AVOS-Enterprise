import { Injectable } from "@nestjs/common";

@Injectable()
export class UniversalSdkIntelligenceService {
  evaluate(input: {
    compatibilityScore: number;
    stabilityScore: number;
    documentationScore: number;
    adoptionScore: number;
  }) {
    const sdkScore = Math.round(
      input.compatibilityScore * 0.3 +
        input.stabilityScore * 0.3 +
        input.documentationScore * 0.2 +
        input.adoptionScore * 0.2,
    );

    return {
      sdkScore,
      readiness:
        sdkScore >= 85
          ? "PRODUCTION"
          : sdkScore >= 65
            ? "BETA"
            : "DEVELOPMENT",
    };
  }
}
