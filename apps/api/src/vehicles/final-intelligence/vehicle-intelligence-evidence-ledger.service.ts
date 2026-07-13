import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleIntelligenceEvidenceLedgerService {
  evaluate(input: {
    integrityScore: number;
    completenessScore: number;
    traceabilityScore: number;
    freshnessScore: number;
  }) {
    const evidenceScore = Math.round(
      input.integrityScore * 0.3 +
        input.completenessScore * 0.25 +
        input.traceabilityScore * 0.3 +
        input.freshnessScore * 0.15,
    );

    return {
      evidenceScore,
      verified: evidenceScore >= 80,
    };
  }
}
