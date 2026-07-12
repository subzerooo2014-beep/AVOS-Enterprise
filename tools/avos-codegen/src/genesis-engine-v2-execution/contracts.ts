export type ExecutionPrimitive = string | number | boolean | null;
export type ExecutionValue =
  | ExecutionPrimitive
  | ExecutionValue[]
  | { [key: string]: ExecutionValue };

export enum ExecutionArtifactKind {
  MODULE = "module",
  CONTROLLER = "controller",
  SERVICE = "service",
  DTO = "dto",
  TEST = "test",
  DOCUMENTATION = "documentation",
  CONFIGURATION = "configuration",
  REGISTRATION = "registration",
}

export enum ExecutionStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export enum ExecutionSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface ExecutionFinding {
  code: string;
  severity: ExecutionSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, ExecutionValue>;
}

export interface GeneratedArtifact {
  id: string;
  kind: ExecutionArtifactKind;
  relativePath: string;
  content: string;
  hash: string;
  sourceModule?: string;
  metadata: Record<string, ExecutionValue>;
}

export interface ExecutionEvidence {
  id: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, ExecutionValue>;
  createdAt: string;
}
