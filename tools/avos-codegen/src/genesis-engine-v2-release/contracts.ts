export type ReleasePrimitive = string | number | boolean | null;
export type ReleaseValue =
  | ReleasePrimitive
  | ReleaseValue[]
  | { [key: string]: ReleaseValue };

export enum ReleaseStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export enum ReleaseSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface ReleaseFinding {
  code: string;
  severity: ReleaseSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, ReleaseValue>;
}

export interface ReleaseArtifactDescriptor {
  relativePath: string;
  hash: string;
  kind: string;
  sizeBytes: number;
}

export interface ReleaseEvidence {
  id: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, ReleaseValue>;
  createdAt: string;
}
