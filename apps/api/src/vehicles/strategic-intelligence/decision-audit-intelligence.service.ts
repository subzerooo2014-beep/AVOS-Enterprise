import { Injectable } from "@nestjs/common";

@Injectable()
export class DecisionAuditIntelligenceService {
  audit(input: {
    evidenceScore: number;
    explainabilityScore: number;
    policyAlignment: number;
    outcomeScore: number;
  }) {
    const auditScore = Math.round(
      input.evidenceScore * 0.3 +
        input.explainabilityScore * 0.25 +
        input.policyAlignment * 0.25 +
        input.outcomeScore * 0.2,
    );

    return {
      auditScore,
      status:
        auditScore >= 85
          ? "VERIFIED"
          : auditScore >= 65
            ? "REVIEW"
            : "FAILED",
    };
  }
}
