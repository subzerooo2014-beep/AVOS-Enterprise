import type {
  GenesisV3Specification,
  GenesisV3Artifact,
} from "../genesis-engine-v3-first-system";

export interface GenesisFinalExecutionInput {
  specification: GenesisV3Specification;
  outputDirectory: string;
  currentVersion: string;
  versionBump: "major" | "minor" | "patch";
  previousVersion?: string | null;
  overwrite?: boolean;
}

export interface GenesisFinalExecutionReport {
  systemKey: string;
  systemName: string;
  outputDirectory: string;
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
  rollbackExecuted: boolean;
  replayManifestCreated: boolean;
  durationMs: number;
}

export interface GenesisFinalExecutionResult {
  success: boolean;
  stage:
    | "generation"
    | "materialization"
    | "validation"
    | "release"
    | "completed";
  artifacts: GenesisV3Artifact[];
  report: GenesisFinalExecutionReport;
  replayManifest: Record<string, unknown>;
  artifactRegistry: Array<{
    relativePath: string;
    hash: string;
    kind: string;
  }>;
  completedAt: string;
}
