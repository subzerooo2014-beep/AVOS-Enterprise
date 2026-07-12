export type UltraMPrimitive = string | number | boolean | null;
export type UltraMValue =
  | UltraMPrimitive
  | UltraMValue[]
  | { [key: string]: UltraMValue };

export enum UltraMSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export enum UltraMStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface UltraMFinding {
  code: string;
  severity: UltraMSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, UltraMValue>;
}

export interface UltraMEvidence {
  id: string;
  systemKey: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, UltraMValue>;
  createdAt: string;
}
