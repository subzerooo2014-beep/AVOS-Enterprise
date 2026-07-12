import { GenesisEndToEndResult } from "./e2e-orchestrator";

export interface GenesisEndToEndHealth {
  healthy: boolean;
  status: string;
  failedStage: string | null;
  blueprintScore: number;
  generationScore: number;
  validationScore: number;
  releaseVersion: string | null;
  artifacts: number;
  findingCount: number;
  evidenceCount: number;
}

export class GenesisEndToEndRuntimeVerifier {
  verify(result: GenesisEndToEndResult): GenesisEndToEndHealth {
    return {
      healthy:
        result.success &&
        result.failedStage === null &&
        result.blueprintScore >= 70 &&
        result.generationScore >= 75 &&
        result.validationScore >= 75 &&
        result.releaseVersion !== null &&
        result.artifacts > 0,
      status: result.status,
      failedStage: result.failedStage,
      blueprintScore: result.blueprintScore,
      generationScore: result.generationScore,
      validationScore: result.validationScore,
      releaseVersion: result.releaseVersion,
      artifacts: result.artifacts,
      findingCount: result.findings.length,
      evidenceCount: result.evidence.length,
    };
  }
}
