import type {
  GenesisEndToEndInput,
  GenesisEndToEndResult,
} from "../genesis-engine-v2-e2e";

export type GenesisCliMode = "dry-run" | "apply";

export interface GenesisCliSpecification {
  mode: GenesisCliMode;
  pipeline: GenesisEndToEndInput;
}

export interface GenesisCliExecutionResult {
  success: boolean;
  mode: GenesisCliMode;
  specificationPath: string;
  pipelineExecuted: boolean;
  pipelineResult: GenesisEndToEndResult | null;
  summary: {
    systemKey: string;
    outputDirectory: string;
    domains: number;
    validationGates: number;
    releaseVersion: string | null;
    failedStage: string | null;
  };
  completedAt: string;
}
