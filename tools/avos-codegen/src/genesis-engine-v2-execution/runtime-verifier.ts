import { GenesisGenerationExecutionResult } from "./execution-orchestrator";

export interface GenesisExecutionHealth {
  healthy: boolean;
  status: string;
  score: number;
  artifacts: number;
  modules: number;
  controllers: number;
  services: number;
  dtos: number;
  tests: number;
  documentation: number;
  registrations: number;
  directories: number;
  validationCommands: number;
  findingCount: number;
  evidenceCount: number;
}

export class GenesisExecutionRuntimeVerifier {
  verify(
    result: GenesisGenerationExecutionResult,
  ): GenesisExecutionHealth {
    const countKind = (kind: string) =>
      result.artifacts.filter((artifact) => artifact.kind === kind).length;

    return {
      healthy:
        result.success &&
        result.artifacts.length > 0 &&
        result.workspacePlan.artifactCount === result.artifacts.length &&
        countKind("module") > 0 &&
        countKind("service") > 0 &&
        countKind("controller") > 0 &&
        countKind("test") > 0,
      status: result.status,
      score: result.score,
      artifacts: result.artifacts.length,
      modules: countKind("module"),
      controllers: countKind("controller"),
      services: countKind("service"),
      dtos: countKind("dto"),
      tests: countKind("test"),
      documentation: countKind("documentation"),
      registrations: countKind("registration"),
      directories: result.workspacePlan.directories.length,
      validationCommands: result.validationCommands.length,
      findingCount: result.findings.length,
      evidenceCount: result.evidence.length,
    };
  }
}
