import { GenesisExecutionResult } from "./genesis-orchestrator";

export interface GenesisEngineV2Health {
  healthy: boolean;
  status: string;
  score: number;
  modules: number;
  generationSteps: number;
  estimatedArtifacts: number;
  validationGates: number;
  documentationItems: number;
  brainRegistrations: number;
  evolutionRegistrations: number;
  findingCount: number;
  evidenceCount: number;
}

export class GenesisEngineV2RuntimeVerifier {
  verify(result: GenesisExecutionResult): GenesisEngineV2Health {
    return {
      healthy:
        result.success &&
        result.blueprint.domains.modules.length > 0 &&
        result.blueprint.generationPlan.steps.length >= 5 &&
        result.blueprint.validationGates.length >= 5 &&
        result.blueprint.enterpriseBrainRegistration.length > 0,
      status: result.status,
      score: result.score,
      modules: result.blueprint.domains.modules.length,
      generationSteps: result.blueprint.generationPlan.steps.length,
      estimatedArtifacts:
        result.blueprint.generationPlan.estimatedArtifacts,
      validationGates: result.blueprint.validationGates.length,
      documentationItems:
        result.blueprint.documentationPlan.length,
      brainRegistrations:
        result.blueprint.enterpriseBrainRegistration.length,
      evolutionRegistrations:
        result.blueprint.evolutionCenterRegistration.length,
      findingCount: result.findings.length,
      evidenceCount: result.evidence.length,
    };
  }
}
