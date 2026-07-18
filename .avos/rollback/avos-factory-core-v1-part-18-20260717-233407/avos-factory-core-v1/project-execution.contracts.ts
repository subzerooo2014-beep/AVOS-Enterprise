import {
  ProjectArtifactKind,
  ProjectGenerationPlan,
  ProjectGeneratorStatus
} from "./project-generator.contracts";

export type ProjectFilesystemTransactionStatus =
  | "prepared"
  | "writing"
  | "ready-to-commit"
  | "committed"
  | "rolled-back"
  | "failed";

export interface ProjectExecutionOptions {
  projectRoot: string;
  dryRun?: boolean;
  overwrite?: boolean;
  humanApproved?: boolean;
  approvedBy?: string;
  verifyAfterCommit?: boolean;
  correlationId?: string;
}

export interface ProjectFilesystemWriteRecord {
  id: string;
  kind: ProjectArtifactKind;
  relativePath: string;
  absolutePath: string;
  bytesWritten: number;
  checksum: string;
  createdAt: string;
}

export interface ProjectFilesystemTransaction {
  id: string;
  planId: string;
  projectId: string;
  projectRoot: string;
  stagingPath: string;
  targetPath: string;
  backupPath?: string;
  status: ProjectFilesystemTransactionStatus;
  overwrite: boolean;
  dryRun: boolean;
  writes: ProjectFilesystemWriteRecord[];
  createdAt: string;
  committedAt?: string;
  rolledBackAt?: string;
  error?: string;
}

export interface ProjectManifestArtifact {
  id: string;
  kind: ProjectArtifactKind;
  relativePath: string;
  bytes: number;
  checksum: string;
}

export interface ProjectManifest {
  schemaVersion: "1.0";
  manifestId: string;
  projectId: string;
  projectName: string;
  projectKind: string;
  planId: string;
  requestId: string;
  generatedBy: "AVOS Factory";
  humanFinalAuthority: true;
  requestedBy: string;
  approvedBy?: string;
  generatedAt: string;
  outputPath: string;
  variables: Record<string, unknown>;
  artifacts: ProjectManifestArtifact[];
}

export interface ProjectVerificationIssue {
  code: string;
  message: string;
  relativePath?: string;
  severity: "error" | "warning";
}

export interface ProjectVerificationResult {
  valid: boolean;
  projectId: string;
  targetPath: string;
  manifestFound: boolean;
  expectedArtifacts: number;
  verifiedArtifacts: number;
  errors: ProjectVerificationIssue[];
  warnings: ProjectVerificationIssue[];
  verifiedAt: string;
}

export interface ProjectExecutionHistoryRecord {
  id: string;
  requestId: string;
  planId: string;
  projectId: string;
  transactionId?: string;
  action:
    | "execution-started"
    | "transaction-prepared"
    | "artifact-written"
    | "manifest-written"
    | "transaction-committed"
    | "verification-completed"
    | "execution-completed"
    | "execution-failed"
    | "rollback-completed";
  status: ProjectGeneratorStatus;
  success: boolean;
  actor: string;
  approvedBy?: string;
  correlationId?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface ProjectExecutionResult {
  success: boolean;
  requestId: string;
  planId: string;
  projectId: string;
  transactionId: string;
  status: ProjectGeneratorStatus;
  targetPath: string;
  manifestPath?: string;
  generatedPaths: string[];
  artifactCount: number;
  verification?: ProjectVerificationResult;
  dryRun: boolean;
  warnings: string[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
  error?: string;
}

export interface ProjectRollbackRequest {
  transactionId: string;
  requestedBy: string;
  humanApproved: boolean;
  approvedBy: string;
  reason: string;
}

export interface ProjectRollbackResult {
  success: boolean;
  transactionId: string;
  projectId: string;
  targetPath: string;
  restoredBackup: boolean;
  rolledBackAt: string;
  approvedBy: string;
  reason: string;
}

export interface ProjectSmokeTestResult {
  success: boolean;
  checks: Record<string, boolean>;
  generatedProjectPath: string;
  rollbackRestored: boolean;
  cleanupCompleted: boolean;
  executedAt: string;
  error?: string;
}

export interface ProjectExecutionInput {
  plan: ProjectGenerationPlan;
  options: ProjectExecutionOptions;
}
