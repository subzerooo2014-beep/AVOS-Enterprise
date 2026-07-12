import { GenesisCliExecutionResult } from "./contracts";

export interface GenesisCliHealth {
  healthy: boolean;
  mode: string;
  pipelineExecuted: boolean;
  releaseVersion: string | null;
  failedStage: string | null;
  domains: number;
  validationGates: number;
}

export class GenesisCliRuntimeVerifier {
  verify(result: GenesisCliExecutionResult): GenesisCliHealth {
    return {
      healthy:
        result.success &&
        result.summary.domains > 0 &&
        (result.mode === "dry-run" ||
          (result.pipelineExecuted &&
            result.summary.releaseVersion !== null &&
            result.summary.failedStage === null)),
      mode: result.mode,
      pipelineExecuted: result.pipelineExecuted,
      releaseVersion: result.summary.releaseVersion,
      failedStage: result.summary.failedStage,
      domains: result.summary.domains,
      validationGates: result.summary.validationGates,
    };
  }
}
