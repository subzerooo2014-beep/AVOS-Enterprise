import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenJsonValue,
  CodeGenMetadata,
} from "../../core/codegen.contracts";

export enum CodeGenEnterpriseSessionStatus {
  CREATED = "created",
  INITIALIZING = "initializing",
  READY = "ready",
  PLANNING = "planning",
  SCHEDULING = "scheduling",
  EXECUTING = "executing",
  VALIDATING = "validating",
  COMMITTING = "committing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  ROLLING_BACK = "rolling_back",
  ROLLED_BACK = "rolled_back",
}

export enum CodeGenEnterpriseSessionMode {
  PREVIEW = "preview",
  GENERATE = "generate",
  REGENERATE = "regenerate",
  RECOVER = "recover",
}

export interface CodeGenEnterpriseGenerationRequest {
  requestId: string;
  workspaceRoot: string;
  targetRoot: string;
  mode: CodeGenEnterpriseSessionMode;
  blueprintKeys: string[];
  generatorKeys: string[];
  templateKeys: string[];
  variables: Record<string, CodeGenJsonValue>;
  artifacts: CodeGenArtifactDescriptor[];
  strict: boolean;
  dryRun: boolean;
  metadata: CodeGenMetadata;
}

export interface CodeGenEnterpriseSessionTimelineEntry {
  status: CodeGenEnterpriseSessionStatus;
  message: string;
  metadata: CodeGenMetadata;
  occurredAt: string;
}

export interface CodeGenEnterpriseGenerationSession {
  id: string;
  request: CodeGenEnterpriseGenerationRequest;
  status: CodeGenEnterpriseSessionStatus;
  artifacts: CodeGenArtifactDescriptor[];
  warnings: string[];
  errors: string[];
  timeline: CodeGenEnterpriseSessionTimelineEntry[];
  metrics: {
    artifacts: number;
    generated: number;
    skipped: number;
    failed: number;
    cacheHits: number;
    cacheMisses: number;
  };
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface CodeGenEnterpriseSessionResult {
  success: boolean;
  session: CodeGenEnterpriseGenerationSession;
  warnings: string[];
  errors: string[];
  completedAt: string;
}
