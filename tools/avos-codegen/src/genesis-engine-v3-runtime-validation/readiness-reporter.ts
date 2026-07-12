import { GenesisV3RuntimeValidationResult } from "./runtime-validation-orchestrator";

export interface GenesisV3RuntimeValidationHealth {
  healthy: boolean;
  status: string;
  qualityScore: number;
  runtimeReady: boolean;
  rollbackRecommended: boolean;
  commands: number;
  passed: number;
  failed: number;
  requiredFailures: number;
  evidenceCount: number;
}

export class GenesisV3RuntimeValidationVerifier {
  verify(
    result: GenesisV3RuntimeValidationResult,
  ): GenesisV3RuntimeValidationHealth {
    const passed = result.commandResults.filter(
      (item) => item.status === "passed",
    ).length;

    const failed = result.commandResults.filter(
      (item) => item.status === "failed",
    ).length;

    return {
      healthy:
        result.success &&
        result.runtimeReady &&
        result.qualityScore >= 80 &&
        result.requiredFailures.length === 0 &&
        !result.rollbackRecommended,
      status: result.status,
      qualityScore: result.qualityScore,
      runtimeReady: result.runtimeReady,
      rollbackRecommended: result.rollbackRecommended,
      commands: result.commandResults.length,
      passed,
      failed,
      requiredFailures: result.requiredFailures.length,
      evidenceCount: result.evidence.length,
    };
  }
}
