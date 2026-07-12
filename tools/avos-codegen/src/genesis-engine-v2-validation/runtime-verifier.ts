import { ValidationPipelineResult } from "./validation-orchestrator";

export interface GenesisValidationHealth {
  healthy: boolean;
  status: string;
  qualityScore: number;
  gates: number;
  passedGates: number;
  failedGates: number;
  requiredFailures: number;
  promotionApproved: boolean;
  promotionStrategy: string;
  findingCount: number;
  evidenceCount: number;
}

export class GenesisValidationRuntimeVerifier {
  verify(result: ValidationPipelineResult): GenesisValidationHealth {
    const passedGates = result.gateResults.filter(
      (gate) => gate.status === "passed",
    ).length;

    const failedGates = result.gateResults.filter(
      (gate) => gate.status === "failed",
    ).length;

    return {
      healthy:
        result.success &&
        result.promotion.approved &&
        result.promotion.failedRequiredGates.length === 0 &&
        result.promotion.qualityScore >= 75,
      status: result.status,
      qualityScore: result.promotion.qualityScore,
      gates: result.gateResults.length,
      passedGates,
      failedGates,
      requiredFailures:
        result.promotion.failedRequiredGates.length,
      promotionApproved: result.promotion.approved,
      promotionStrategy: result.promotion.strategy,
      findingCount: result.findings.length,
      evidenceCount: result.evidence.length,
    };
  }
}
