import { V4FrontendGenerationResult } from "./orchestrator";

export interface V4FrontendHealth {
  healthy: boolean;
  status: string;
  score: number;
  artifacts: number;
  pages: number;
  forms: number;
  tables: number;
  apiClients: number;
  states: number;
  tests: number;
  rbacArtifacts: number;
  evidenceCount: number;
}

export class GenesisV4ProductionFrontendRuntimeVerifier {
  verify(result: V4FrontendGenerationResult): V4FrontendHealth {
    return {
      healthy:
        result.success &&
        result.score >= 80 &&
        result.pages > 0 &&
        result.forms > 0 &&
        result.tables > 0 &&
        result.apiClients > 0 &&
        result.tests > 0,
      status: result.status,
      score: result.score,
      artifacts: result.artifacts.length,
      pages: result.pages,
      forms: result.forms,
      tables: result.tables,
      apiClients: result.apiClients,
      states: result.states,
      tests: result.tests,
      rbacArtifacts: result.rbacArtifacts,
      evidenceCount: result.evidence.length,
    };
  }
}
