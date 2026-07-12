export type WorkspacePrimitive = string | number | boolean | null;
export type WorkspaceValue =
  | WorkspacePrimitive
  | WorkspaceValue[]
  | { [key: string]: WorkspaceValue };

export enum WorkspaceExecutionStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export enum WorkspaceExecutionMode {
  DRY_RUN = "dry-run",
  APPLY = "apply",
}

export enum WorkspaceSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface WorkspaceFinding {
  code: string;
  severity: WorkspaceSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, WorkspaceValue>;
}

export interface WorkspaceArtifactInput {
  relativePath: string;
  content: string;
  hash: string;
  overwrite: boolean;
}

export interface WorkspaceOperationResult {
  relativePath: string;
  absolutePath: string;
  action: "create" | "overwrite" | "skip";
  success: boolean;
  verified: boolean;
  previousHash: string | null;
  currentHash: string | null;
  message: string;
}

export interface WorkspaceEvidence {
  id: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, WorkspaceValue>;
  createdAt: string;
}
