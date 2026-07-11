import {
  CodeGenJsonValue,
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenConflictPolicy,
  CodeGenGenerationReport,
  CodeGenOutputManifest,
} from "../../output/codegen-output.contracts";

export enum CodeGenUnifiedGenerationMode {
  BLUEPRINT = "blueprint",
  GENERATOR = "generator",
  TEMPLATE = "template",
}

export interface CodeGenUnifiedGenerationRequest {
  mode: CodeGenUnifiedGenerationMode;
  key: string;
  workspaceRoot: string;
  targetRoot: string;
  variables: Record<string, CodeGenJsonValue>;
  dryRun: boolean;
  strict: boolean;
  conflictPolicy: CodeGenConflictPolicy;
  metadata?: CodeGenMetadata;
}

export interface CodeGenUnifiedGenerationResult {
  success: boolean;
  mode: CodeGenUnifiedGenerationMode;
  key: string;
  artifacts: CodeGenArtifactDescriptor[];
  manifest?: CodeGenOutputManifest;
  report?: CodeGenGenerationReport;
  warnings: string[];
  errors: string[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
}
