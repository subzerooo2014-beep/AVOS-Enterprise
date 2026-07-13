import { Injectable } from "@nestjs/common";

@Injectable()
export class GlobalStandardsObservatoryService {
  evaluate(input: {
    regulatoryScore: number;
    securityScore: number;
    privacyScore: number;
    interoperabilityScore: number;
  }) {
    const standardsScore = Math.round(
      input.regulatoryScore * 0.3 +
        input.securityScore * 0.25 +
        input.privacyScore * 0.25 +
        input.interoperabilityScore * 0.2,
    );

    return {
      standardsScore,
      status:
        standardsScore >= 85
          ? "ALIGNED"
          : standardsScore >= 65
            ? "PARTIAL"
            : "GAP",
    };
  }
}
