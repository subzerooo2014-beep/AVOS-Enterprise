import { V4BackendGenerationResult } from "./orchestrator";

export interface V4BackendHealth {
  healthy: boolean;
  status: string;
  score: number;
  artifacts: number;
  modules: number;
  controllers: number;
  services: number;
  dtos: number;
  repositories: number;
  policies: number;
  events: number;
  tests: number;
  evidenceCount: number;
}

export class GenesisV4ProductionBackendRuntimeVerifier {
  verify(result: V4BackendGenerationResult): V4BackendHealth {
    return {
      healthy:
        result.success &&
        result.score >= 80 &&
        result.modules > 0 &&
        result.controllers > 0 &&
        result.services > 0 &&
        result.dtos > 0 &&
        result.repositories > 0 &&
        result.tests > 0,
      status: result.status,
      score: result.score,
      artifacts: result.artifacts.length,
      modules: result.modules,
      controllers: result.controllers,
      services: result.services,
      dtos: result.dtos,
      repositories: result.repositories,
      policies: result.policies,
      events: result.events,
      tests: result.tests,
      evidenceCount: result.evidence.length,
    };
  }
}
