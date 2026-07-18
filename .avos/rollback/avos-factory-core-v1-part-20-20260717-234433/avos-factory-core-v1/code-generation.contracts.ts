export type GenerationStatus =
  | "pending"
  | "validating"
  | "generating"
  | "writing"
  | "completed"
  | "failed"
  | "rolled-back";

export type GeneratedArtifactType =
  | "typescript"
  | "javascript"
  | "json"
  | "markdown"
  | "text"
  | "configuration"
  | "unknown";

export interface CodeGenerationRequest {
  id?: string;
  blueprintId: string;
  blueprintVersion: string;
  stepId: string;
  providerId: string;
  target: string;
  outputPath?: string;
  input?: Record<string, unknown>;
  variables?: Record<string, unknown>;
  dryRun?: boolean;
  overwrite?: boolean;
  requestedBy: string;
  approvedBy?: string;
  humanApproved?: boolean;
  correlationId?: string;
}

export interface GeneratedArtifact {
  id: string;
  generationId: string;
  type: GeneratedArtifactType;
  relativePath: string;
  absolutePath?: string;
  content: string;
  contentLength: number;
  checksum: string;
  written: boolean;
  overwritten: boolean;
  createdAt: string;
}

export interface CodeGenerationProviderContext {
  generationId: string;
  blueprintId: string;
  blueprintVersion: string;
  stepId: string;
  target: string;
  input: Record<string, unknown>;
  variables: Record<string, unknown>;
  requestedBy: string;
  correlationId?: string;
}

export interface CodeGenerationProviderResult {
  success: boolean;
  artifacts: Array<{
    path: string;
    content: string;
    type?: GeneratedArtifactType;
  }>;
  warnings?: string[];
  metadata?: Record<string, unknown>;
}

export interface CodeGenerationProvider {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly supportedTargets: string[];

  supports(target: string): boolean;

  generate(
    context: CodeGenerationProviderContext
  ):
    | CodeGenerationProviderResult
    | Promise<CodeGenerationProviderResult>;
}

export interface GenerationValidationIssue {
  code: string;
  message: string;
  path?: string;
  severity: "error" | "warning";
}

export interface GenerationValidationResult {
  valid: boolean;
  errors: GenerationValidationIssue[];
  warnings: GenerationValidationIssue[];
}

export interface GenerationExecutionRecord {
  id: string;
  generationId: string;
  blueprintId: string;
  blueprintVersion: string;
  stepId: string;
  providerId: string;
  target: string;
  status: GenerationStatus;
  success: boolean;
  dryRun: boolean;
  artifactCount: number;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  requestedBy: string;
  approvedBy?: string;
  correlationId?: string;
  error?: string;
  warnings: string[];
}

export interface GenerationMetricsSnapshot {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  dryRunExecutions: number;
  rolledBackExecutions: number;
  generatedArtifacts: number;
  writtenArtifacts: number;
  registeredProviders: number;
  averageDurationMs: number;
  calculatedAt: string;
}

export interface GenerationExecutionResult {
  success: boolean;
  generationId: string;
  status: GenerationStatus;
  providerId: string;
  target: string;
  dryRun: boolean;
  artifacts: GeneratedArtifact[];
  warnings: string[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
  error?: string;
}
