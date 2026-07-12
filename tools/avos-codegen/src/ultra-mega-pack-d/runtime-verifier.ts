import { UltraMegaPackDResult } from "./orchestrator";

export interface UltraMegaPackDHealth {
  healthy: boolean;
  decision: string;
  score: number;
  constitutionCompliant: boolean;
  strategicScore: number;
  resilienceScore: number;
  standardsCoverage: number;
  decisionConfidence: number;
  controlCount: number;
  findingCount: number;
  evidenceCount: number;
}

export class UltraMegaPackDRuntimeVerifier {
  verify(result: UltraMegaPackDResult): UltraMegaPackDHealth {
    return {
      healthy:
        result.success &&
        result.constitution.compliant &&
        result.resilience.aggregateScore >= 50 &&
        result.standards.coverage >= 50,
      decision: result.decision,
      score: result.score,
      constitutionCompliant: result.constitution.compliant,
      strategicScore: result.strategy.score,
      resilienceScore: result.resilience.aggregateScore,
      standardsCoverage: result.standards.coverage,
      decisionConfidence: result.trace.aggregateConfidence,
      controlCount: result.controls.length,
      findingCount: result.findings.length,
      evidenceCount: result.evidence.length,
    };
  }
}
