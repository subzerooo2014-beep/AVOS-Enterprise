import { GenesisIntegrationResult } from "./genesis-integration";

export interface UltraMegaPackBHealth {
  healthy: boolean;
  decision: string;
  score: number;
  controlCount: number;
  findingCount: number;
  evidenceCount: number;
}

export class UltraMegaPackBRuntimeVerifier {
  verify(
    result: GenesisIntegrationResult,
  ): UltraMegaPackBHealth {
    return {
      healthy: result.success,
      decision: result.decision,
      score: result.score,
      controlCount: result.controls.length,
      findingCount: result.findings.length,
      evidenceCount: result.evidence.length,
    };
  }
}
