import {
  GenesisGenerationResult,
} from "./contracts";

export interface GenesisRuntimeHealth {
  healthy: boolean;
  systemId: string;
  status: string;
  blueprintCount: number;
  capabilityCount: number;
  stageCount: number;
  successfulStages: number;
  artifactCount: number;
  evidenceCount: number;
  knowledgeCount: number;
  validationScore: number;
}

export class GenesisRuntimeVerifier {
  verify(
    result:
      GenesisGenerationResult,
  ): GenesisRuntimeHealth {
    const successfulStages =
      result.stageResults.filter(
        (stage) =>
          stage.success,
      ).length;

    const healthy =
      result.success &&
      result.validation.valid &&
      successfulStages ===
        result.stageResults.length;

    return {
      healthy,
      systemId:
        result.specification.id,
      status:
        result.specification.status,
      blueprintCount:
        result.composition.selectedBlueprints.length,
      capabilityCount:
        result.graph.nodes.length,
      stageCount:
        result.stageResults.length,
      successfulStages,
      artifactCount:
        result.artifacts.length,
      evidenceCount:
        result.evidence.length,
      knowledgeCount:
        result.knowledge.length,
      validationScore:
        result.validation.score,
    };
  }
}
