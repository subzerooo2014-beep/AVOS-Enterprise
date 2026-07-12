import { GenesisFactoryResult } from "./genesis-factory";

export interface UltraMegaPackCHealth {
  healthy: boolean;
  decision: string;
  score: number;
  controlCount: number;
  findingCount: number;
  evidenceCount: number;
}

export class UltraMegaPackCRuntimeVerifier {
  verify(result: GenesisFactoryResult): UltraMegaPackCHealth {
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
