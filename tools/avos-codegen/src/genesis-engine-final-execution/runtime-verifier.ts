import { GenesisFinalExecutionResult } from "./contracts";

export interface GenesisFinalExecutionHealth {
  healthy: boolean;
  stage: string;
  generatedArtifacts: number;
  materializedOperations: number;
  validationCommands: number;
  qualityScore: number;
  runtimeReady: boolean;
  releaseVersion: string | null;
  enterpriseBrainRegistered: boolean;
  evolutionCenterRegistered: boolean;
  blueprintRegistryRegistered: boolean;
  artifactRegistryEntries: number;
  replayManifestCreated: boolean;
  rollbackExecuted: boolean;
}

export class GenesisFinalExecutionRuntimeVerifier {
  verify(
    result: GenesisFinalExecutionResult,
  ): GenesisFinalExecutionHealth {
    return {
      healthy:
        result.success &&
        result.stage === "completed" &&
        result.report.generatedArtifacts > 0 &&
        result.report.materializedOperations > 0 &&
        result.report.validationCommands > 0 &&
        result.report.qualityScore >= 80 &&
        result.report.runtimeReady &&
        result.report.releaseVersion !== null &&
        result.report.enterpriseBrainRegistered &&
        result.report.evolutionCenterRegistered &&
        result.report.blueprintRegistryRegistered &&
        result.report.artifactRegistryEntries > 0 &&
        result.report.replayManifestCreated &&
        !result.report.rollbackExecuted,
      stage: result.stage,
      generatedArtifacts: result.report.generatedArtifacts,
      materializedOperations: result.report.materializedOperations,
      validationCommands: result.report.validationCommands,
      qualityScore: result.report.qualityScore,
      runtimeReady: result.report.runtimeReady,
      releaseVersion: result.report.releaseVersion,
      enterpriseBrainRegistered:
        result.report.enterpriseBrainRegistered,
      evolutionCenterRegistered:
        result.report.evolutionCenterRegistered,
      blueprintRegistryRegistered:
        result.report.blueprintRegistryRegistered,
      artifactRegistryEntries:
        result.report.artifactRegistryEntries,
      replayManifestCreated:
        result.report.replayManifestCreated,
      rollbackExecuted:
        result.report.rollbackExecuted,
    };
  }
}
